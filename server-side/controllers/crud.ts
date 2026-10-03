import DB from "./db";
import type { SchemaName } from './db';
import escape from 'escape-html';
import type { Request, Response } from "express";

export const KEY = "id";

export default function factoryController(schema: SchemaName) {
    return {
        async all(req: Request, res: Response) {
            const data = await DB.read(schema);
            res.json(data || []);
        },
        async read(req: Request, res: Response) {
            const key = req.params[KEY];
            if (typeof key !== 'string') {
                res.sendStatus(400);
                return;
            }
            const data = await DB.read(schema, key);
            res.json(data || []);
        },
        async create(req: Request, res: Response) {
            const body = req.body;
            const file = req.file;
            if (file) {
                delete body._id
                const fileField = file.fieldname === 'covidTest' ? 'role.clientDetails.covidTest' : file.fieldname;
                await DB.create(schema, {...body, [fileField]: file.filename})
            } else {
                await DB.create(schema, body)
            }

            res.send(escape(body));
        },
        async update(req: Request, res: Response) {
            let body = req.body;
            const key = req.params[KEY];
            if (typeof key !== 'string') {
                res.sendStatus(400); //Bad Request
                return;
            }
            const file = req.file;
            if (file) {
                delete body._id
                const fileField = file.fieldname === 'covidTest' ? 'role.clientDetails.covidTest' : file.fieldname;
                await DB.update(schema, {$set: {...body, [fileField]: file.filename}}, key)
            } else {
                await DB.update(schema, {$set: body}, key);
            }

            res.sendStatus(204);
        },
        async delete(req: Request, res: Response) {
            const key = req.params[KEY];
            if (typeof key !== 'string') {
                res.sendStatus(400); //Bad Request
                return;
            }
            await DB.delete(schema, key);
            res.sendStatus(204);
        },
    };
}
