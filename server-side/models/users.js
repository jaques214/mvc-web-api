import mongoose from 'mongoose';
import {clientSchema} from './clients.js';
const { Schema } = mongoose;

export const userSchema = new Schema({
    name: String,
    username: {
        type: String,
        required: [true, "Username is required"]
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    role: {
        value: {
            type: String,
            enum: {
                values: ['Client', 'Promoter', 'Admin'],
                message: '{VALUE} is not a valid user role'
            },
            required: true
        },
        clientDetails: clientSchema
    }
});

const User = mongoose.model('User', userSchema);
export default User;