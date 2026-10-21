import express, { type NextFunction, type Request, type Response } from "express";
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

const app = express();

app.use(rateLimitMiddleware, auth.verifySession);

app.use("/auth", authController);

const userController =  async (req: Request, res: Response, next: NextFunction) => {
  const { body } = req;
  try {
    const address = await Address.findOne({street: {$eq: body.address}});

    if(address){
      body.address = address;
    } else {
      res.sendStatus(400);
      return;
    }
  } catch (error) {
    console.error(error);
  }
  return next()
}

app.use(
  "/users",
  factoryCrudRouter("users", {
    remove: [requireAuth, userController],
    update: [requireAuth, covidTestUpload, userController],
    all: [requireAuth],
    read: [requireAuth],
    create: [requireAuth]
  })
);

const eventController =  async (req: Request, res: Response, next: NextFunction) => {
  const { body } = req;

  if(body.sessions){
    body.sessions = JSON.parse(body.sessions);
  }
  if(body.tickets){
    body.tickets = body._id ? JSON.parse(body.tickets) : [];
  }
  const showroom = await Showroom.findOne({name: { $eq: body.showroom}});
  if(showroom){
    body.showroom = showroom;
  } else {
    res.sendStatus(400);
    return;
  }
  if(body.poster === "undefined"){
    delete body.poster
  }
  return next()
}

const ticketController = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    res.status(400).json({ message: "A COVID test file is required" });
    return;
  }
  if (typeof req.body.eventId !== "string" || !isValidObjectId(req.body.eventId)) {
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
  const session = event.sessions.find((candidate) => candidate._id.toString() === req.body.sessionId);
  if (!session) {
    res.status(400).json({ message: "Session does not belong to the selected event" });
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
  })
);

app.use(
  "/showrooms",
  factoryCrudRouter("showrooms", {
    remove: [requireAuth],
    create: [requireAuth],
    update: [requireAuth],
  })
);
app.use(
  "/tickets",
  factoryCrudRouter("tickets", {
    create: [requireAuth, covidTestUpload, ticketController],
    remove: [requireAuth, checkPermissionLevel(permissions.promoter)],
    all: [requireAuth, checkPermissionLevel(permissions.promoter)],
    update: [requireAuth, checkPermissionLevel(permissions.promoter)],
  })
);

export default app;
