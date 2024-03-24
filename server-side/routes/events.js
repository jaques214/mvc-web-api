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
  keys: ['poster', 'title', 'description', 'showroom', 'promoter', "saleStartDate", "saleEndDate", 'price', 'minimumAge', 'sessions']
}

export default eventInfo;