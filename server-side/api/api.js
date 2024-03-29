import express from "express";
import multer from "multer";
import factoryCrudRouter from "./crudRouter.js";
import permissions from "../utils/permissionsLevel.js";
import { checkPermissionLevel, requireAuth } from "./auth.js";
import authController, { auth } from "../controllers/auth.js";
import Showroom from "../models/showrooms.js";
import Address from "../models/address.js";
import rateLimitMiddleware from "../utils/rateLimit.js";

let app = express();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.use(rateLimitMiddleware, auth.verifySession);

app.use("/auth", authController);

const userController =  async (req, res, next) => {
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
    
  }
  return next()
}

app.use(
  "/users",
  factoryCrudRouter("users", {
    delete: [requireAuth, userController],
    update: [requireAuth, upload.single("covidTest"), userController],
    all: [requireAuth],
    create: [requireAuth]
  })
);

const eventController =  async (req, res, next) => {
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
    create: [requireAuth, upload.single("poster"), eventController],
    update: [requireAuth, upload.single("poster"), eventController],
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
