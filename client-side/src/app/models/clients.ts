import {Address} from './address';
import {Ticket} from './tickets';

export class Client {

    constructor(
        public _id?:string,
        public address?: Address,
        public isOverAge?: boolean,
        public nif?: string,
        public email?: string,
        public covidTest?: string,
        public tickets?: Ticket[]) {
        }

    static fields(){
        return {
            inputs: [
              {
                label: 'I have more than the minimum age',
                name: 'isOverAge',
                type: 'select',
                placeholder: 'Enter Title',
                iconlabel: 'account circle icon',
                icon: 'account_circle',
                model: undefined,
              },
              {
                label: 'Email',
                name: 'email',
                type: 'email',
                placeholder: 'Enter email',
                iconlabel: 'email icon',
                icon: 'email',
                model: undefined,
            },
              {
                name: 'title',
                type: 'text',
                placeholder: 'Enter Title',
                iconlabel: 'account circle icon',
                icon: 'account_circle',
                model: undefined,
              },
              {
                name: 'title',
                type: 'text',
                placeholder: 'Enter Title',
                iconlabel: 'account circle icon',
                icon: 'account_circle',
                model: undefined,
              }
        ]}
    }
}