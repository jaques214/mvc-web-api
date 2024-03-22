export default function template(res, info, data = []){
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