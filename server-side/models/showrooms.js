import mongoose from 'mongoose';
import {addressSchema} from './address.js';
const { Schema } = mongoose;

export const showroomSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  address: {
    type: addressSchema,
    required: [true, 'Address is required']
},
  email: String,
  tel: String,
  capacity: Number,
  limit: {
    type: Number,
    required: true,
    default: 1  
  }
});

const Showroom = mongoose.model("Showroom", showroomSchema);
export default Showroom;
