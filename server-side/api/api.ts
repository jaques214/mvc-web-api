import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import factoryCrudRouter from "./crudRouter";
import permissions from "../utils/permissionsLevel";
import { checkPermissionLevel, requireAuth } from "./auth";
import authController, { auth } from "../controllers/auth";
import Event from "../models/events";
import Showroom from "../models/showrooms";
import Address from "../models/address";
import rateLimitMiddleware from "../utils/rateLimit";
import { covidTestUpload, posterUpload } from "../utils/fileUpload";
import { isValidObjectId } from "mongoose";
import { fetchWeatherApi } from "openmeteo";

const app = express();

app.use(rateLimitMiddleware, auth.verifySession);

app.use("/auth", authController);

const userController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { body } = req;
  try {
    const address = await Address.findOne({ street: { $eq: body.address } });

    if (address) {
      body.address = address;
    } else {
      res.sendStatus(400);
      return;
    }
  } catch (error) {
    console.error(error);
  }
  return next();
};

app.use(
  "/users",
  factoryCrudRouter("users", {
    remove: [requireAuth, userController],
    update: [requireAuth, covidTestUpload, userController],
    all: [requireAuth],
    read: [requireAuth],
    create: [requireAuth],
  }),
);

const eventController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { body } = req;

  if (body.sessions) {
    body.sessions = JSON.parse(body.sessions);
  }
  if (body.tickets) {
    body.tickets = body._id ? JSON.parse(body.tickets) : [];
  }
  const showroom = await Showroom.findOne({ name: { $eq: body.showroom } });
  if (showroom) {
    body.showroom = showroom;
  } else {
    res.sendStatus(400);
    return;
  }
  if (body.poster === "undefined") {
    delete body.poster;
  }
  return next();
};

const ticketController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.file) {
    res.status(400).json({ message: "A COVID test file is required" });
    return;
  }
  if (
    typeof req.body.eventId !== "string" ||
    !isValidObjectId(req.body.eventId)
  ) {
    res.status(400).json({ message: "A valid event identifier is required" });
    return;
  }
  if (typeof req.body.sessionId !== "string") {
    res.status(400).json({ message: "A session is required" });
    return;
  }

  const event = await Event.findById(req.body.eventId);
  if (!event) {
    res.status(404).json({ message: "Event not found" });
    return;
  }
  const session = event.sessions.find(
    (candidate) => candidate._id.toString() === req.body.sessionId,
  );
  if (!session) {
    res
      .status(400)
      .json({ message: "Session does not belong to the selected event" });
    return;
  }

  req.body.eventTitle = event.title;
  req.body.session = {
    sessionId: session._id.toString(),
    date: session.date,
    startTime: session.startTime,
    endTime: session.endTime,
  };
  delete req.body.sessionId;
  next();
};

app.use(
  "/events",
  factoryCrudRouter("events", {
    remove: [requireAuth],
    create: [requireAuth, posterUpload, eventController],
    update: [requireAuth, posterUpload, eventController],
  }),
);

app.use(
  "/showrooms",
  factoryCrudRouter("showrooms", {
    remove: [requireAuth],
    create: [requireAuth],
    update: [requireAuth],
  }),
);

/* app.post(
  "/tickets/checkout",
  requireAuth,
  rateLimitMiddleware,
  createStripeCheckoutSession,
); */

app.get(
  "/events/:eventId/sessions/:sessionId/weather",
  requireAuth,
  rateLimitMiddleware,
  async (req: Request, res: Response) => {
    const eventID = req.params["eventId"];
    if (typeof eventID !== "string") {
      res.sendStatus(400);
      return;
    }
    const sessionID = req.params["sessionId"];
    if (typeof sessionID !== "string") {
      res.sendStatus(400);
      return;
    }

    const eventData = await Event.findById(eventID).lean().exec();

    if (!eventData) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    if (
      eventData.showroom.address.city === undefined &&
      eventData.showroom.address.postalCode === undefined
    ) {
      res.status(404).json({ message: "Invalid city for geocoding API" });
      return;
    }

    const geocodingUrl = new URL(
      "https://geocoding-api.open-meteo.com/v1/search",
    );
    geocodingUrl.searchParams.set("name", "Porto");
    geocodingUrl.searchParams.set("count", "10");
    geocodingUrl.searchParams.set("language", "en");
    geocodingUrl.searchParams.set("format", "json");

    const geocodingResponse = await fetch(geocodingUrl);
    if (!geocodingResponse.ok) {
      res.status(502).json({ message: "Geocoding service request failed" });
      return;
    }

    const geocodingData = await geocodingResponse.json();

    if (
      typeof geocodingData !== "object" ||
      geocodingData === null ||
      !("results" in geocodingData) ||
      !Array.isArray(geocodingData.results)
    ) {
      res
        .status(502)
        .json({ message: "Geocoding service returned invalid data" });
      return;
    }

    const coordinates = geocodingData.results.find(
      (result): result is { latitude: number; longitude: number } =>
        typeof result === "object" &&
        result !== null &&
        "latitude" in result &&
        typeof result.latitude === "number" &&
        "longitude" in result &&
        typeof result.longitude === "number",
    );
    if (!coordinates) {
      res.status(404).json({ message: "No location found for this event" });
      return;
    }

    const session = eventData.sessions.find(
      (session) => session._id.toString() === sessionID,
    );

    if (!session) {
      res.status(404).json({ message: "Session not found" });
      return;
    }

    const params = {
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      start_date: session.date.toISOString().slice(0, 10),
      end_date: session.date.toISOString().slice(0, 10),
      hourly: ["temperature_2m", "weather_code"],
      timezone: "auto",
    };

    const url = "https://historical-forecast-api.open-meteo.com/v1/forecast";
    const responses = await fetchWeatherApi(url, params);

    // Process first location. Add a for-loop for multiple locations or weather models
    const response = responses[0];

    if (!response) {
      res.status(502).json({ message: "Weather service returned no data" });
      return;
    }

    const elevation = response.elevation();
    const utcOffsetSeconds = response.utcOffsetSeconds();

    const hourly = response.hourly();
    if (!hourly) {
      res
        .status(502)
        .json({ message: "Weather service returned no hourly data" });
      return;
    }
    const temperature = hourly.variables(0);
    if (!temperature) {
      res
        .status(502)
        .json({ message: "Weather service returned no temperature data" });
      return;
    }

    res.json({
      hourly: {
        time: Array.from(
          {
            length:
              (Number(hourly.timeEnd()) - Number(hourly.time())) /
              hourly.interval(),
          },
          (_, i) =>
            new Date(
              (Number(hourly.time()) +
                i * hourly.interval() +
                utcOffsetSeconds) *
                1000,
            ),
        ),
        elevation: `${elevation}m asl`,

        temperature_2m: hourly.variables(0)!.valuesArray(),
        weather_code: hourly.variables(1)!.valuesArray(),
      },
    });
  },
);

app.use(
  "/tickets",
  factoryCrudRouter("tickets", {
    create: [requireAuth, covidTestUpload, ticketController],
    remove: [requireAuth, checkPermissionLevel(permissions.promoter)],
    all: [requireAuth, checkPermissionLevel(permissions.promoter)],
    update: [requireAuth, checkPermissionLevel(permissions.promoter)],
  }),
);

export default app;
