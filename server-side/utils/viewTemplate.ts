import type { Response } from "express";

export default function template(res: Response, info: any, data = []){
  const results = Array.isArray(data) ? data : [data];
  try {
    res.render('results', {
      title: 'Title',
      description: 'description',
      message: '',
      results,
      ...info
    });
  }
  catch(error) {
    console.error(error)
  }
}