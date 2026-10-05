import type { Address } from './address';
import type { Ticket } from './tickets';

export type Client = {
  _id: string;
  address: Address;
  isOverAge: boolean;
  nif: string,
  email: string,
  covidTest: string,
  tickets: Ticket[];
}

export const clientFields = () => [
  {
    label: 'I have more than the minimum age',
    name: 'isOverAge',
    type: 'select',
    placeholder: 'Enter Title',
    iconlabel: 'account circle icon',
    icon: 'account_circle',
  },
  {
    label: 'Email',
    name: 'email',
    type: 'email',
    placeholder: 'Enter email',
    iconlabel: 'email icon',
    icon: 'email',
  },
  {
    name: 'title',
    type: 'text',
    placeholder: 'Enter Title',
    iconlabel: 'account circle icon',
    icon: 'account_circle',
  },
  {
    name: 'title',
    type: 'text',
    placeholder: 'Enter Title',
    iconlabel: 'account circle icon',
    icon: 'account_circle',
  }
];