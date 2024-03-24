import express from 'express';
import createError from 'http-errors';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import mongoose from 'mongoose';
import cors from 'cors';
import 'dotenv/config';
//import swaggerUi from 'swagger-ui-express';
//import swaggerDocument from './swagger/swagger.json';

import apiRouter from './api/api.js';
import {usersInfo, upload} from './routes/users.js';
import eventInfo from './routes/events.js';
import {promoterInfo} from './routes/promoters.js';
import {showroomsInfo} from './routes/showrooms.js';
import {ticketsInfo} from './routes/tickets.js';
import {loginFormInfo,loginSuccessInfo,loginFailureInfo} from './routes/login.js';
import {RegisterFormInfo,RegisterSuccessInfo,RegisterFailureInfo} from './routes/register.js';
import {getAuthTokenFromRequest, getData, postData} from "./utils/routesHelpers.js";
import template from "./utils/viewTemplate.js";

const __dirname = new URL('./', import.meta.url).pathname.slice(1);
console.log('dirname ', __dirname);

let app = express();

mongoose.Promise = global.Promise;

try {
  await mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.info("DB connected successfully")
} catch (error) {
  console.error(error + '\nFailed connecting to DB!');
}


app.use(cors({ origin: 'http://localhost:4200' }));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));

//app.use(upload.single());

//app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
//app.use('/api/v1', productsRouter);
app.use(express.static('uploads'));

// view engine setup
app.set('view engine', 'ejs');

app.get('/', function(req, res, next) {
  res.redirect('/register');
});

app.use('/api', apiRouter);

app.get('/users', async function(req, res, next) {
  const response = await getData('users', getAuthTokenFromRequest(req))

  if(response.status === 401) {
    res.redirect('register')
    return;
  }
  const jsonData = response.status === 200 ? await response.json() : {};
  let count = 1;
  const results = jsonData.map((user) => {
    return {
      id: count++,
      email: '-',
      role: user.role.value,
      ...user,
    }
  })
  template(res, usersInfo, results);
});
app.post('/users', upload.single('covidTest'), async function(req, res, next) {
  await postData(req, 'users')
  const response = await getData('users', getAuthTokenFromRequest(req))
  const jsonData = response.status === 200 ? await response.json() : {};
  template(res, usersInfo, jsonData);
});

app.get('/events', async function(req, res, next) {
  const response = await getData('events', getAuthTokenFromRequest(req))
  const jsonData = response.status === 200 ? await response.json() : {};
  const results = jsonData.map((event) => {
    return {
      ...event,
      showroom: event.showroom.name,
      sessions: event.sessions.length
    }
  })
  template(res, eventInfo, results);
});

app.post('/events', async function(req, res, next) {
  await postData(req, 'events');
  const response = await getData('events', getAuthTokenFromRequest(req))
  const jsonData = response.status === 200 ? await response.json() : {};
  template(res, eventInfo, jsonData);
});

app.get('/promoters', async function(req, res, next) {
  const response = await getData('promoters', getAuthTokenFromRequest(req))
  const jsonData = response.status === 200 ? await response.json() : {};
  template(res, promoterInfo, jsonData);
});
app.post('/promoters', async function(req, res, next) {
  await postData(req, 'promoters');
  const response = await getData('promoters', getAuthTokenFromRequest(req))
  const jsonData = response.status === 200 ? await response.json() : {};
  template(res, promoterInfo, jsonData);
});

app.get('/showrooms', async function(req, res, next) {
  const response = await getData('showrooms', getAuthTokenFromRequest(req))
  const jsonData = response.status === 200 ? await response.json() : {};
  const results = jsonData.map((showroom) => {
    return {
      ...showroom,
      address: `${showroom.address.street}, nº ${showroom.address.number}, ${showroom.address.postalCode}, ${showroom.address.country}`,
    }
  })
  template(res, showroomsInfo, results);
});
app.post('/showrooms', async function(req, res, next) {
  await postData(req, 'showrooms');
  const response = await getData('showrooms', getAuthTokenFromRequest(req))
  const jsonData = response.status === 200 ? await response.json() : {};
  template(res, showroomsInfo, jsonData);
});

app.get('/tickets', async function(req, res, next) {
  const response = await getData('tickets', getAuthTokenFromRequest(req))
  const jsonData = response.status === 200 ? await response.json() : {};
  template(res, ticketsInfo, jsonData);
});
app.post('/tickets', async function(req, res, next) {
  await postData(req, 'tickets');
  const response = await getData('tickets', getAuthTokenFromRequest(req))
  const jsonData = response.status === 200 ? await response.json() : {};
  template(res, ticketsInfo, jsonData);
});

app.get('/login', async function(req, res, next) {
  template(res, loginFormInfo);
});
app.post('/login', async function(req, res, next) {
  const login = await postData(req, 'login');
  const body = await login.json();
  res.cookie('AuthToken', body.token);
  res.render('results', {
    ...loginFormInfo,
    results: [],
    message: login.status === 200 ? loginSuccessInfo : loginFailureInfo
  });
});

app.get('/register', async function(req, res, next) {
  template(res, RegisterFormInfo);
});
app.post('/register', async function(req, res, next) {
  const register = await postData(req, 'login/register');
  template(res, register.status === 201 ? RegisterSuccessInfo : RegisterFailureInfo);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json(err);
});

export default app;
