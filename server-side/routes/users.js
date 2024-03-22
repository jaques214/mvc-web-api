import multer from 'multer';

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'views_uploads');
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '.txt');
    }
});

export const upload = multer({storage: storage});

export const usersInfo = {
  title: 'Users', 
  description: 'list of all Users', 
  inputs: [{
    name:'username',
    type:'text',
    placeholder:'name'
  }, {
    name:'email',
    type: 'text',
    placeholder:'email'
  },
  {
    name:'covidTest',
    type: 'file',
    placeholder:'covidTest'
  }],
  keys: ['id', 'username', 'email', 'covidTest']
}