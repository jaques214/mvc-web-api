import { model, Schema, type InferSchemaType, type HydratedDocument } from "mongoose";

const ticketSessionSchema = new Schema({
    sessionId: String,
    date: Date,
    startTime: Date,
    endTime: Date,
}, { _id: false });

export const ticketsSchema = new Schema({
    nCancelled: Number,
    status: String,
    eventId: String,
    eventTitle: String,
    session: ticketSessionSchema,
    covidTest: String,
    price: Number,
    type: Number,
    paymentMethod: {
        type: String,
        enum: {
            values: ['PayPal', 'Transferência Bancária', 'VISA', 'Cartão de Crédito', 'MBWAY', 'Dinheiro', 'Multibanco'],
            message: '{VALUE} is not supported'
        }
    },
    saleDate: Date
});

export type ITicket = InferSchemaType<typeof ticketsSchema>;
export type ITicketDocument = HydratedDocument<ITicket>;

const Ticket = model('Tickets', ticketsSchema);
export default Ticket;