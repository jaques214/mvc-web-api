import { addressFields, type Address } from './address';

export type Showroom = {
  _id: string;
  name: string;
  address: Address;
  email: string;
  tel: string;
  capacity: number;
  limit: number;
}

export const realCapacity = (capacity: number = 0, limit: number = 1) => capacity * limit;

export const showroomFields = () => [
  {
    label: 'Name',
    name: 'name',
    type: 'text',
    placeholder: 'Enter Name',
    iconlabel: 'event seat icon',
    icon: 'event_seat',
  },
  {
    label: 'Address',
    name: 'address',
    type: 'complex',
    inputs: addressFields(),
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
    label: 'Telephone',
    name: 'tel',
    type: 'tel',
    placeholder: 'Enter telephone',
    iconlabel: 'call icon',
    icon: 'call',
  },
  {
    label: 'Capacity',
    name: 'capacity',
    type: 'number',
    placeholder: 'Enter capacity',
    iconlabel: 'account circle icon',
    icon: 'account_circle',
  },
  {
    label: 'Limit %',
    name: 'limit',
    type: 'number',
    placeholder: 'Enter limit',
    iconlabel: 'account circle icon',
    icon: 'account_circle',
  },
];
