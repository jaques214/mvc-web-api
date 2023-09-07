import express from 'express';
import createError from 'http-errors';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import mongoose from 'mongoose';
import cors from 'cors';
import 'dotenv/config';
//import swaggerUi from 'swagger-ui-express';
//import swaggerDocument from './swagger/swagger.json';

const __dirname = new URL('./', import.meta.url).pathname.slice(1);
console.log('dirname ', __dirname);

import upRouter from './routes/index.js';
import apiRouter from './api/api.js';
import usersRouter from './routes/users.js';
import eventsRouter from './routes/events.js';
import promotersRouter from './routes/promoters.js';
import showroomsRouter from './routes/showrooms.js';
import ticketsRouter from './routes/tickets.js';
import loginRouter from './routes/login.js';
import registerRouter from './routes/register.js';

let app = express();

mongoose.Promise = global.Promise;

try {
  await mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
} catch (error) {
  console.error(error + '\nFailed connecting to DB!');
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors({ origin: 'http://localhost:4200' }));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use(upload.single());

//app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
//app.use('/api/v1', productsRouter);
app.use(express.static('uploads'));

app.use('/', upRouter);
app.use('/api', apiRouter);
app.use('/users', usersRouter);
app.use('/events', eventsRouter);
app.use('/promoters', promotersRouter);
app.use('/showrooms', showroomsRouter);
app.use('/tickets', ticketsRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  console.log('error ', createError(404));
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json(err);
});

export default app;
