import template from '../utils/viewTemplate.js';
import {postData, getAuthTokenFromResponse} from '../utils/routesHelpers.js';
import express from 'express';
const router = express.Router();

const loginFormInfo = {
  title:'Login',
  description:'use this form to login to your account',
  inputs:[{
    name:'username',
    type:'text',
    placeholder:'username'
  }, {
    name:'password',
    type: 'password',
    placeholder:'password'
  }]
}

const loginSuccessInfo = {
  title:'Login',
  description:'the login was successful',
}

const loginFailureInfo = {
  title:'Login',
  description:'the login fail, those credentials are not correct',
}

router.get('/', async function(req, res, next) {
  template(res, loginFormInfo);
});
router.post('/', async function(req, res, next) {
    const login = await postData(req, 'login');
    res.cookie('AuthToken', getAuthTokenFromResponse(login));
    template(res, login.status == 201 ? loginSuccessInfo : loginFailureInfo);
});

export default router;
