import mongoose from 'mongoose';
import { showroomSchema } from './showrooms.js';
import { ticketsSchema } from './tickets.js';
const { Schema } = mongoose;

export const eventSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Event title is mandatory']
  },
  description: {
    type: String,
    maxlength: [200, 'description must not exceed {VALUE} characteres'],
    required: [true, 'Event description is mandatory']
  },
  poster: {
    type: String,
    required: [true, 'You must upload a poster'],
  },
  sessions: [{
    date: { type: Date, default: Date.now },
    startTime: { type: Date, default: Date.now },
    endTime: { type: Date, default: Date.now },
  }],
  saleStartDate: { type: Date, default: Date.now },
  saleEndDate: { type: Date, default: Date.now },
  minimumAge: {
    type: Number,
    min: 1,
    max: 100
  },
  price: {
    type: Number,
    required: true
  },
  tickets: [ticketsSchema],
  showroom: {
    type: showroomSchema,
    required: [true, 'An event must have a showroom']
  },
  promoter: {
    type: String,
    required: [true, 'An event must have a promoter']
  },
});

const Event = mongoose.model("CulturalEvent", eventSchema);
export default Event;