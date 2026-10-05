enum Method {
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
    price?: number;
    status?: string;
    type?: TicketType;
    paymentMethod?: Method;
    event?: string;
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