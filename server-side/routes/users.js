import template from '../utils/viewTemplate.js';
import {getData, postData, getAuthTokenFromRequest} from '../utils/routesHelpers.js';
import multer from 'multer';
import express from 'express';
const router = express.Router();

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'views_uploads');
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '.txt');
    }
});

const upload = multer({storage: storage});

const userInfo = {
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

router.get('/', async function(req, res, next) {
  template(res, userInfo, await getData('users', getAuthTokenFromRequest(req)));
});
router.post('/', upload.single('covidTest'), async function(req, res, next) {
  await postData(req, 'users');
  template(res, userInfo, await getData('users', getAuthTokenFromRequest(req)));
});

export default router;