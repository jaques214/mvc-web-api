import express, { type Express, type Request, type Response, type NextFunction } from 'express';
import createError from 'http-errors';
import { STATUS_CODES } from 'node:http';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import fs from 'fs';
import morgan from 'morgan'
import cors from 'cors';
import 'dotenv/config';
//import swaggerUi from 'swagger-ui-express';
//import swaggerDocument from './swagger/swagger.json';

import apiRouter from './api/api';
import {usersInfo, upload} from './routes/users';
import eventInfo from './routes/events';
import {promoterInfo} from './routes/promoters';
import {showroomsInfo} from './routes/showrooms';
import {ticketsInfo} from './routes/tickets';
import {loginFormInfo,loginSuccessInfo,loginFailureInfo} from './routes/login';
import {RegisterFormInfo,RegisterSuccessInfo,RegisterFailureInfo} from './routes/register';
import {getAuthTokenFromRequest, getData, postData} from "./utils/routesHelpers";
import template from "./utils/viewTemplate";
import type { IUserDocument } from './models/users';
import type { IShowroomDocument } from './models/showrooms';
import type { IEventDocument } from './models/events';
import { xss } from 'express-xss-sanitizer'
import { ipKeyGenerator, rateLimit } from 'express-rate-limit'

const __dirname = new URL('./', import.meta.url).pathname.slice(1);
console.log('dirname ', __dirname);

const app: Express = express();

mongoose.Promise = global.Promise;

const mongoUrl = process.env.MONGO_URL;
if (!mongoUrl) {
  throw new Error('MONGO_URL is not set');
}

try {
  await mongoose.connect(mongoUrl, {
  });
  console.info("DB connected successfully")
} catch (error) {
  console.error(`${error}\nFailed connecting to DB!`);
  throw error;
}

// Create a rate limit middleware
const limiter = rateLimit({
  max: 100,
  windowMs: 15 * 60 * 1000, // 15 minutes
  keyGenerator: (req) => {
    const authorization = req.get('authorization');
    if (authorization) return authorization;
    if (!req.ip) throw new Error('Unable to determine client IP for rate limiting');
    return ipKeyGenerator(req.ip);
  },
});


app.use(cors({ origin: 'http://localhost:4200' }));
app.use(limiter);

// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream('access.log', { flags: 'a' })

// setup the logger
app.use(morgan('combined', { stream: accessLogStream }))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));

app.use(xss());

//app.use(upload.single());

//app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
//app.use('/api/v1', productsRouter);
app.use(express.static('uploads'));

// view engine setup
app.set('view engine', 'ejs');

app.get('/', function(req: Request, res: Response, next: NextFunction) {
  res.redirect('/register');
});

app.use('/api', apiRouter);

app.get('/users', async function(req: Request, res: Response, next: NextFunction) {
  const response = await getData('users', getAuthTokenFromRequest(req))

  if(response.status === 401) {
    res.redirect('register')
    return;
  }
  const jsonData = response.status === 200 ? await response.json() : {};
  let count = 1;
  const results = jsonData.map((user: IUserDocument) => {
    return {
      email: '-',
      role: user.role ? user.role.value : '-',
      ...user,
      id: count++,
    }
  })
  template(res, usersInfo, results);
});
app.post('/users', upload, async function(req: Request, res: Response, next: NextFunction) {
  await postData(req, 'users')
  const response = await getData('users', getAuthTokenFromRequest(req))
  const jsonData = response.status === 200 ? await response.json() : {};
  template(res, usersInfo, jsonData);
});

app.get('/events', async function(req: Request, res: Response, next: NextFunction) {
  const response = await getData('events', getAuthTokenFromRequest(req))
  const jsonData = response.status === 200 ? await response.json() : {};
  const results = jsonData.map((event: IEventDocument) => {
    return {
      ...event,
      showroom: event.showroom.name,
      sessions: event.sessions.length
    }
  })
  template(res, eventInfo, results);
});

app.post('/events', async function(req: Request, res: Response, next: NextFunction) {
  await postData(req, 'events');
  const response = await getData('events', getAuthTokenFromRequest(req))
  const jsonData = response.status === 200 ? await response.json() : {};
  template(res, eventInfo, jsonData);
});

app.get('/promoters', async function(req: Request, res: Response, next: NextFunction) {
  const response = await getData('promoters', getAuthTokenFromRequest(req))
  const jsonData = response.status === 200 ? await response.json() : {};
  template(res, promoterInfo, jsonData);
});
app.post('/promoters', async function(req: Request, res: Response, next: NextFunction) {
  await postData(req, 'promoters');
  const response = await getData('promoters', getAuthTokenFromRequest(req))
  const jsonData = response.status === 200 ? await response.json() : {};
  template(res, promoterInfo, jsonData);
});

app.get('/showrooms', async function(req: Request, res: Response, next: NextFunction) {
  const response = await getData('showrooms', getAuthTokenFromRequest(req))
  const jsonData = response.status === 200 ? await response.json() : {};
  const results = jsonData.map((showroom: IShowroomDocument) => {
    return {
      ...showroom,
      address: `${showroom.address.street}, nº ${showroom.address.number}, ${showroom.address.postalCode}, ${showroom.address.country}`,
    }
  })
  template(res, showroomsInfo, results);
});
app.post('/showrooms', async function(req: Request, res: Response, next: NextFunction) {
  await postData(req, 'showrooms');
  const response = await getData('showrooms', getAuthTokenFromRequest(req))
  const jsonData = response.status === 200 ? await response.json() : {};
  template(res, showroomsInfo, jsonData);
});

app.get('/tickets', async function(req: Request, res: Response, next: NextFunction) {
  const response = await getData('tickets', getAuthTokenFromRequest(req))
  const jsonData = response.status === 200 ? await response.json() : {};
  template(res, ticketsInfo, jsonData);
});
app.post('/tickets', async function(req: Request, res: Response, next: NextFunction) {
  await postData(req, 'tickets');
  const response = await getData('tickets', getAuthTokenFromRequest(req))
  const jsonData = response.status === 200 ? await response.json() : {};
  template(res, ticketsInfo, jsonData);
});

app.get('/login', async function(req: Request, res: Response, next: NextFunction) {
  template(res, loginFormInfo);
});
app.post('/login', async function(req: Request, res: Response, next: NextFunction) {
  const login = await postData(req, 'login');
  const body = await login.json();
  res.cookie('AuthToken', body.token, { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 86400000 });
  res.render('results', {
    ...loginFormInfo,
    results: [],
    message: login.status === 200 ? loginSuccessInfo : loginFailureInfo
  });
});

app.get('/register', async function(req: Request, res: Response, next: NextFunction) {
  template(res, RegisterFormInfo);
});
app.post('/register', async function(req: Request, res: Response, next: NextFunction) {
  const register = await postData(req, 'login/register');
  template(res, register.status === 201 ? RegisterSuccessInfo : RegisterFailureInfo);
});

// catch 404 and forward to error handler
app.use(function (req: Request, res: Response, next: NextFunction) {
  next(createError(404));
});

// error handler
app.use((err: Error & { status?: number }, req: Request, res: Response, next: NextFunction) => {
  const statusCode = typeof err === 'object' && err && 'status' in err && typeof err.status === 'number'
    ? err.status
    : 500;
  const message = statusCode >= 500
    ? 'Internal server error'
    : STATUS_CODES[statusCode] ?? 'Request failed';

  console.error(err);

  res.status(statusCode).json({
    message,
    status: statusCode,
  });
});

export default app;

