import mongoose from 'mongoose';
import {addressSchema} from './address.js';
import {ticketsSchema} from './tickets.js';
const { Schema } = mongoose;

export const clientSchema = new Schema({
    address: {
        type: addressSchema,
        required: [true, 'Address is required']
    },
    isOverAge: {
        type: Boolean,
        required: [true, 'Client must be over 18 years old']
    },
    email: String,
    nif: {
        type: Number,
        minlength: 9
    },
    iban: {
        type: String
    },
    covidTest: {
        type: String,
        required: [true, 'You must upload a valid test']
    },
    tickets: [ticketsSchema]
});

const Client = mongoose.model('Client', clientSchema);
export default Client;