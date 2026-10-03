
import { model, Schema, type InferSchemaType } from 'mongoose';
import {addressSchema} from './address';
import type { HydratedDocument } from 'mongoose';

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

export type IShowroom = InferSchemaType<typeof showroomSchema>;
export type IShowroomDocument = HydratedDocument<IShowroom>;

const Showroom = model("Showroom", showroomSchema);
export default Showroom;
