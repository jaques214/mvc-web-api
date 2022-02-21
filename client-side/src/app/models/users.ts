import { Client } from '@models/clients';

class Role {
    constructor(
        public value: string,
        public clientDetails?: Client
    ) {}
}

export class User {

    constructor(
        public token?:string,
        public _id?:string,
        public name?: string,
        public username?: string,
        public password?: string,
        public role?: Role) {}

    static fields(){
        return {
            inputs: [
            {
                label: 'Username',
                name: 'username',
                type: 'text',
                placeholder: 'Enter username',
                iconlabel: 'account circle icon',
                icon: 'account_circle',
                model: undefined,
            },
            {
                label: 'Password',
                name: 'password',
                type: 'password',
                placeholder: 'Enter password',
                iconlabel: 'no encryption icon',
                icon: 'no_encryption',
                model: undefined,
            },
            {
                label: 'Name',
                name: 'name',
                type: 'text',
                placeholder: 'Enter name',
                iconlabel: 'person icon',
                icon: 'person',
                model: undefined,
            },
            {
                label: 'Role',
                name: 'role',
                type: 'text',
                placeholder: 'Choose role',
                iconlabel: 'person icon',
                icon: 'person',
                model: undefined,
            },
        ]}
    }
}