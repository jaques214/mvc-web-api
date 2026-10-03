import express, { type RequestHandler } from 'express';
import factoryController, { KEY } from '../controllers/crud';
import type { SchemaName } from '../controllers/db';
import rateLimitMiddleware from '../utils/rateLimit';

type CrudOptions = {
  all?: RequestHandler[];
  read?: RequestHandler[];
  create?: RequestHandler[];
  update?: RequestHandler[];
  remove?: RequestHandler[];
};

const defaultOptions: CrudOptions = {
  all: [],
  read: [],
  create: [],
  update: [],
  remove: [],
};

function getOptions(options?: RequestHandler[]) {
  return options ?? [];
}

export default function factoryCrudRouter(schema: SchemaName, options: CrudOptions = defaultOptions) {
  const { all, read, create, update, remove } = options;
  const crud = express.Router();
  const controller = factoryController(schema);

  crud.get('/', ...getOptions(all), controller.all);
  crud.post('/', ...getOptions(create), rateLimitMiddleware, controller.create);
  crud.get(`/:${KEY}`, ...getOptions(read), controller.read);
  crud.put(`/:${KEY}`, ...getOptions(update), rateLimitMiddleware, controller.update);
  crud.delete(`/:${KEY}`, ...getOptions(remove), rateLimitMiddleware, controller.delete);

  return crud;
}