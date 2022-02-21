import template from '../utils/viewTemplate.js';
import {getData, postData, getAuthTokenFromRequest} from '../utils/routesHelpers.js';
import express from 'express';
const router = express.Router();

const eventInfo = {
  title: 'Events', 
  description: 'list of all events', 
  inputs: [{
    name:'name',
    type:'text',
    placeholder:'name'
  }, {
    name:'description',
    type: 'text',
    placeholder:'description'
  }, {
    name:'poster',
    type: 'file',
    placeholder:'poster'
  }, {
    name:'dateFrom',
    type: 'date',
    placeholder:'dateFrom'
  }, {
    name:'dateTo',
    type: 'date',
    placeholder:'dateTo'
  }, {
    name:'showrooms',
    type: 'number',
    placeholder:'showrooms'
  }, {
    name:'promoter',
    type: 'text',
    placeholder:'promoter'
  }],
  keys: ['name', 'description', 'showrooms', 'promoter']
}

router.get('/', async function(req, res, next) {
  template(res, eventInfo, await getData('events', getAuthTokenFromRequest(req)));
});
router.post('/', async function(req, res, next) {
  await postData(req, 'events');
  template(res, eventInfo, await getData('events', getAuthTokenFromRequest(req)));
});

export default router;