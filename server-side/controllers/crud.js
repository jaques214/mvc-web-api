import fileSystem from 'fs';

import DB from "./db.js";
import escape from 'escape-html';
import sanitize from "sanitize-filename"

const fs = fileSystem.promises;
export const KEY = "id";

export default function factoryController(schema) {
    return {
        async all(req, res) {
            const data = await DB.read(schema);
            res.json(data || []);
        },
        async read(req, res) {
            const data = await DB.read(schema, req.params[KEY]);
            res.json(data || []);
        },
        async create(req, res) {
            const body = req.body;
            console.log(body)
            try {
                const file = req.file;
                if (file) {
                    console.log("File is: ", file)
                    let filepath = sanitize(file.path)
                    const data = await fs.readFile(filepath);
                    await fs.writeFile('./' + filepath, data);
                    delete body._id
                    await DB.create(schema, {...body, poster: file.filename})
                } else {
                    await DB.create(schema, body)
                }

                res.send(escape(body));
            } catch (error) {
                console.error('The error is: ' + error)
            }
        },
        async update(req, res) {
            let body = req.body;
            if (req.params[KEY] == null) {
                res.sendStatus(400); //Bad Request
                return;
            }
            try {
                const file = req.file;
                if (file) {
                    const data = await fs.readFile(sanitize(file.path));
                    await fs.writeFile('./' + sanitize(file.path), data);
                    delete body._id
                    await DB.update(schema, {$set: {...body, poster: {$eq: file.filename}}}, req.params[KEY])
                } else {
                    await DB.update(schema, {$set: body}, req.params[KEY]);
                }

                res.sendStatus(204);
            } catch (error) {
                console.error('The error is:' + error)
            }
        },
        async delete(req, res) {
            if (req.params[KEY] == null) {
                res.sendStatus(400); //Bad Request
                return;
            }
            await DB.delete(schema, req.params[KEY]);
            res.sendStatus(204);
        },
    };
}
