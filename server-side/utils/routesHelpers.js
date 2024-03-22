import fetch from 'node-fetch';

export function getAuthTokenFromRequest(request){
  return request?.headers?.cookie?.split('AuthToken=')?.[1]?.split(';')?.[0] || '';
}

export async function postData(req, api){
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

  const response = await fetch('http://localhost:3000/api/auth/' + api, {
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

export async function getData(api, token){
  return await fetch('http://localhost:3000/api/' + api, {
    headers: {
      'x-access-token': token,
    },
  })
}