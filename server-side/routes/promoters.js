import template from '../utils/viewTemplate.js';
import {getData, postData, getAuthTokenFromRequest} from '../utils/routesHelpers.js';
import express from 'express';
const router = express.Router();

const promoterInfo = {
  title: 'Promoters', 
  description: 'list of all promoters', 
  inputs: [{
    name:'name',
    type:'text',
    placeholder:'name'
  }, {
    name:'type',
    type: 'number',
    placeholder:'type'
  }],
  keys: ['name', 'type']
}

router.get('/', async function(req, res, next) {
  template(res, promoterInfo, await getData('promoters', getAuthTokenFromRequest(req)));
});
router.post('/', async function(req, res, next) {
  await postData(req, 'promoters');
  template(res, promoterInfo, await getData('promoters', getAuthTokenFromRequest(req)));
});

export default router;