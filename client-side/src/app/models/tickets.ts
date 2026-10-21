export enum Method {
    PayPal = "PayPal",
    Banco = "Transferência Bancária",
    Visa = "VISA",
    CartaoCredito = "Cartão de Crédito",
    Mbway = "MBWAY",
    Dinheiro = "Dinheiro",
    Multibanco = "Multibanco",
}

export enum TicketType {
    Family,
    Single,
}

export type Ticket = {
    _id?: string;
    eventId?: string;
    eventTitle?: string;
    session?: {
        sessionId: string;
        date: Date | string;
        startTime: Date | string;
        endTime: Date | string;
    };
    sessionId?: string;
    covidTest?: File | string;
    price?: number;
    status?: string;
    type?: TicketType;
    paymentMethod?: Method;
    saleDate?: Date;
}

export const ticketFields = () => [
    {
        name: 'name',
        type: 'text',
    },
    {
        name: 'named',
        type: 'number',
    }
]