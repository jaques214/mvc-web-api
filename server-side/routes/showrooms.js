import template from '../utils/viewTemplate.js';
import {getData, postData, getAuthTokenFromRequest} from '../utils/routesHelpers.js';
import express from 'express';
const router = express.Router();

const showroomsInfo = {
  title: 'Showrooms', 
  description: 'list of all showrooms', 
  inputs: [{
    name:'name',
    type:'text',
    placeholder:'name'
  }, {
    name:'capacity',
    type: 'number',
    placeholder:'capacity'
  }, {
    name:'capacityLimit',
    type: 'number',
    placeholder:'capacityLimit'
  }, {
    name:'address',
    type: 'text',
    placeholder:'address'
  }],
  keys: ['name', 'capacity', 'capacityLimit', 'address']
}

router.get('/', async function(req, res, next) {
  template(res, showroomsInfo, await getData('showrooms', getAuthTokenFromRequest(req)));
});
router.post('/', async function(req, res, next) {
  await postData(req, 'showrooms');
  template(res, showroomsInfo, await getData('showrooms', getAuthTokenFromRequest(req)));
});

export default router;