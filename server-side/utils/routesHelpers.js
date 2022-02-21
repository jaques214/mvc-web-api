import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';
export function getAuthTokenFromResponse(response){
  return response?.headers?.get('Set-Cookie').split('AuthToken=')?.[1]?.split(';')?.[0] || '';
}

export function getAuthTokenFromRequest(request){
  return request?.headers?.cookie?.split('AuthToken=')?.[1]?.split(';')?.[0] || '';
}

export async function postData(req, api){
  const token = getAuthTokenFromRequest(req);
  const contentType = req.header('Content-Type');
  const hasFile = contentType.startsWith('multipart/form-data');
  if(hasFile) {
    const form = new FormData();
    for(let key of Object.keys(req.body)){
      form.append(key, req.body[key]);
    }
    form.append('covidTest',  fs.createReadStream('./views_uploads/covidTest.txt'));
    const formPromise = new Promise((resolve, reject) => {
      form.submit('http://localhost:3000/api/' + api, (err, res) => {
        if(err){
          return reject(err);
        }
        resolve(res);
      });
    })
    return formPromise;
  }
  return fetch('http://localhost:3000/api/' + api, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      cookie: 'AuthToken=' + token
    },
    method: 'POST',
    body: JSON.stringify(req.body)
  });
}

export async function getData(api, token){
  const response = await fetch('http://localhost:3000/api/' + api, {
    headers:{
      cookie: 'AuthToken=' + token
    },
  })
  return response.status == 200 ? response.json() : {};
}

export default {
  getAuthTokenFromRequest,
  getAuthTokenFromResponse,
  postData,
  getData
}