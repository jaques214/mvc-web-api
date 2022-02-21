import template from '../utils/viewTemplate.js';
import {getData, postData, getAuthTokenFromRequest} from '../utils/routesHelpers.js';
import express from 'express';
const router = express.Router();

const ticketsInfo = {
  title: 'Tickets', 
  description: 'list of all tickets', 
  inputs: [{
    name:'price',
    type:'number',
    placeholder:'price'
  }, {
    name:'status',
    type: 'text',
    placeholder:'status'
  }, {
    name:'type',
    type: 'text',
    placeholder:'type'
  }, {
    name:'paymentMethod',
    type: 'text',
    placeholder:'paymentMethod'
  }, {
    name:'event',
    type: 'number',
    placeholder:'event'
  }],
  keys: ['price', 'status', 'type', 'paymentMethod', 'event']
}

router.get('/', async function(req, res, next) {
  template(res, ticketsInfo, await getData('tickets', getAuthTokenFromRequest(req)));
});
router.post('/', async function(req, res, next) {
  await postData(req, 'tickets');
  template(res, ticketsInfo, await getData('tickets', getAuthTokenFromRequest(req)));
});

export default router;