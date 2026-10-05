import { Client } from './clients';

type Role = {
    value: string;
    clientDetails?: Client;
}

export type User = {
    token?: string;
    _id?: string;
    name?: string;
    username?: string;
    password?: string;
    role?: Role;
}

export const userFields = () => [
    {
        label: 'Username',
        name: 'username',
        type: 'text',
        placeholder: 'Enter username',
        iconlabel: 'account circle icon',
        icon: 'account_circle',
    },
    {
        label: 'Password',
        name: 'password',
        type: 'password',
        placeholder: 'Enter password',
        iconlabel: 'no encryption icon',
        icon: 'no_encryption',
    },
    {
        label: 'Name',
        name: 'name',
        type: 'text',
        placeholder: 'Enter name',
        iconlabel: 'person icon',
        icon: 'person',
    },
    {
        label: 'Role',
        name: 'role',
        type: 'text',
        placeholder: 'Choose role',
        iconlabel: 'person icon',
        icon: 'person',
    },
];