import express from 'express';
import factoryController, { KEY } from '../controllers/crud.js';
import rateLimitMiddleware from "../utils/rateLimit.js";

const defaultOptions = {
    all: [],
    read: [],
    create: [],
    update: [],
    remove: []
}

function getOptions(options) {
    return options?options:[];
}

export default function factoryCrudRouter(schema, options=defaultOptions) {
    const {all, read, create, update, remove} = options;
    const crud = express.Router();
    const controller = factoryController(schema);
    crud.get('/', getOptions(all), controller.all);
    crud.post('/', getOptions(create), rateLimitMiddleware, controller.create);
    crud.get(`/:${KEY}`, getOptions(read), controller.read);
    crud.put(`/:${KEY}`, getOptions(update), rateLimitMiddleware, controller.update);
    crud.delete(`/:${KEY}`, getOptions(remove), rateLimitMiddleware, controller.delete);
    return crud;
};