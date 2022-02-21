import template from '../utils/viewTemplate.js';
import {postData} from '../utils/routesHelpers.js';
import express from 'express';
const router = express.Router();

const RegisterFormInfo = {
  title:'Register',
  description:'use this form to register to your account',
  inputs:[{
    name:'email',
    type:'text',
    placeholder:'email'
  }, {
    name:'username',
    type:'text',
    placeholder:'username'
  }, {
    name:'password',
    type: 'password',
    placeholder:'password'
  }, {
    name:'type',
    type: 'number',
    placeholder:'type'
  }]
}

const RegisterSuccessInfo = {
  title:'Register',
  description:'the registration was successful',
}

const RegisterFailureInfo = {
  title:'Register',
  description:'the registration failed, those credentials are not correct',
}

router.get('/', async function(req, res, next) {
  template(res, RegisterFormInfo);
});
router.post('/', async function(req, res, next) {
    const register = await postData(req, 'login/register');
    console.log( await register.text());
    template(res, register.status == 201 ? RegisterSuccessInfo : RegisterFailureInfo);
});

export default router;