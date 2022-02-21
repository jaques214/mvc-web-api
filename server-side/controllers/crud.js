import fileSystem from 'fs';
import DB from "./db.js";
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
      // if (!validateFields(fieldsBySchema(schema), body) ) {
      //   res.sendStatus(400);
      //   return;
      // }
      try {
        const file = req.file;
        if(file){
          
          const data = await fs.readFile(file.path);
          await fs.writeFile('./' + file.path, data);
          delete body._id
          await DB.create(schema, {...body, poster: file.filename })
        }else{
          await DB.create(schema, body)
        } 

        res.send(body);
      } catch (error) {
        res.send('The error is:' + error);
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
        if(file){
          const data = await fs.readFile(file.path);
          await fs.writeFile('./' + file.path, data);
          delete body._id
          await DB.update(schema, {...body, poster: file.filename }, req.params[KEY])
        }else{
          await DB.update(schema, body, req.params[KEY]);
        } 

        res.sendStatus(204);
      } catch (error) {
        res.send('The error is:' + error);
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
