export const ticketsInfo = {
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