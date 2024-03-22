export const showroomsInfo = {
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