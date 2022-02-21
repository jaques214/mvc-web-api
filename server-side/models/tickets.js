import mongoose from 'mongoose';
const { Schema } = mongoose;

export const ticketsSchema = new Schema({
    nCancelled: Number,
    status: String,
    eventTitle: String,
    // paymentMethod: {
    //     type: String,
    //     enum: {
    //         values: ['PayPal', 'Transferência Bancária', 'VISA', 'Cartão de Crédito', 'MBWAY', 'Dinheiro', 'Multibanco'],
    //         message: '{VALUE} is not supported'
    //     }
    // },
    saleDate: Date
});

const Ticket = mongoose.model('Tickets', ticketsSchema);
export default Ticket;