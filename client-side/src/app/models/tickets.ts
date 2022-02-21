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

export class Ticket {
    constructor(public _id?:string, public price?: number, public status?: string, public type?: TicketType, public paymentMethod?: Method, public event?: string) {}

    fields(){
        return [
            {
                name: 'name',
                type: 'text',
            },
            {
                name: 'named',
                type: 'number',
            }
        ]
    }
}