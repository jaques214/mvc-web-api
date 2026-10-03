import fetch from 'node-fetch';
import type { Request } from 'express';

const apiBaseUrl = (process.env.API_BASE_URL ?? `http://localhost:${process.env.PORT ?? '3000'}`).replace(/\/+$/, '');

export function getAuthTokenFromRequest(request: Request): string {
  return request?.headers?.cookie?.split('AuthToken=')?.[1]?.split(';')?.[0] || '';
}

export async function postData(req: Request, api: string){
  //const token = getAuthTokenFromRequest(req);
  //const contentType = req.header('Content-Type');
  //console.log("contentType", contentType)
  /*const hasFile = contentType.startsWith('multipart/form-data');
  if(hasFile) {
    console.log(hasFile)
    const form = new FormData();
    console.log(req.body)
    for(let key of Object.keys(req.body)){
      form.append(key, req.body[key]);
    }
    form.append('covidTest',  fs.createReadStream('./views_uploads/covidTest.txt'));

    return new Promise((resolve, reject) => {
      form.submit('http://localhost:3000/api/auth/' + api, (err, res) => {
        if(err){
          return reject(err);
        }
        resolve(res);
      });
    })
  }*/

  const response = await fetch(`${apiBaseUrl}/api/auth/${api}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      //cookie: 'AuthToken=' + token
    },
    method: 'POST',
    body: JSON.stringify(req.body)
  })
  return response;
}

export async function getData(api: string, token: string){
  return await fetch(`${apiBaseUrl}/api/${api}`, {
    headers: {
      'x-access-token': token,
    },
  })
}