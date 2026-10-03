import express, { type NextFunction, type Request, type Response } from "express";
import factoryCrudRouter from "./crudRouter";
import permissions from "../utils/permissionsLevel";
import { checkPermissionLevel, requireAuth } from "./auth";
import authController, { auth } from "../controllers/auth";
import Showroom from "../models/showrooms";
import Address from "../models/address";
import rateLimitMiddleware from "../utils/rateLimit";
import { covidTestUpload, posterUpload } from "../utils/fileUpload";

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
    remove: [requireAuth, checkPermissionLevel(permissions.promoter)],
    all: [requireAuth, checkPermissionLevel(permissions.promoter)],
    update: [requireAuth, checkPermissionLevel(permissions.promoter)],
  })
);

export default app;
