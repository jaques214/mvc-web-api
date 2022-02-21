export default function template(res, info, data = []){
  const results = Array.isArray(data) ? data : [data];
  res.render('results', {
    title: 'Title', 
    description: 'description', 
    keys:[],
    results,
    inputs:[],
    ...info
  });
}