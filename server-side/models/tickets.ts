import { model, Schema, type InferSchemaType, type HydratedDocument } from "mongoose";

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

export type ITicket = InferSchemaType<typeof ticketsSchema>;
export type ITicketDocument = HydratedDocument<ITicket>;

const Ticket = model('Tickets', ticketsSchema);
export default Ticket;