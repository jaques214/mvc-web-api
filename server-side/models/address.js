import mongoose from 'mongoose';
const { Schema } = mongoose;

export const addressSchema = new Schema({
    street: {
        type: String,
        required: [true, 'Street is mandatory!']
    },
    number:  {
        type: Number,
        required: [true, 'Address number is mandatory!'],
        min: 1,
        max: 9999
    },
    postalCode: {
        type: String,
        validate: {
            validator: function(v) {
              return /\d{4}-\d{3}/.test(v);
            },
            message: props => `${props.value} is not a valid postal-code!`
          },
        required: [true, 'Postal-code is mandatory!']
    },
    country: {
        type: String,
        required: [true, 'Country is mandatory!']
    },
});

const Address = mongoose.model('Address', addressSchema);
export default Address;