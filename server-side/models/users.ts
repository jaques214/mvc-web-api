import { Schema, model, type InferSchemaType, type HydratedDocument } from 'mongoose';
import {clientSchema} from './clients';

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

export type IUser = InferSchemaType<typeof userSchema>;
export type IUserDocument = HydratedDocument<IUser>;

const User = model('User', userSchema);
export default User;