import { Address } from './address';

export class Showroom {
  constructor(
    public _id?: string,
    public name?: string,
    public address?: Address,
    public email?: string,
    public tel?: string,
    public capacity: number = 0,
    public limit: number = 1
  ) {}

  get realCapacity(): number {
    return this.capacity * this.limit;
  }

  static fields() {
    return {
      inputs: [
        {
          label: 'Name',
          name: 'name',
          type: 'text',
          placeholder: 'Enter Name',
          iconlabel: 'event seat icon',
          icon: 'event_seat',
          model: undefined,
        },
        Showroom.addressFields(),
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
          label: 'Telephone',
          name: 'tel',
          type: 'tel',
          placeholder: 'Enter telephone',
          iconlabel: 'call icon',
          icon: 'call',
          model: undefined,
        },
        {
          label: 'Capacity',
          name: 'capacity',
          type: 'number',
          placeholder: 'Enter capacity',
          iconlabel: 'account circle icon',
          icon: 'account_circle',
          model: undefined,
        },
        {
          label: 'Limit %',
          name: 'limit',
          type: 'number',
          placeholder: 'Enter limit',
          iconlabel: 'account circle icon',
          icon: 'account_circle',
          model: undefined,
        },
      ],
    };
  }

  static addressFields() {
    return {
      name: 'address',
      type: 'complex',
      inputs: [
        {
          label: 'Country',
          name: 'country',
          type: 'text',
          placeholder: 'Enter Country',
          iconlabel: 'streetview icon',
          icon: 'streetview',
          model: undefined,
        },
        {
          label: 'Number',
          name: 'number',
          type: 'text',
          placeholder: 'Enter Number',
          iconlabel: 'streetview icon',
          icon: 'streetview',
          model: undefined,
        },
        {
          label: 'PostalCode',
          name: 'postalCode',
          type: 'text',
          placeholder: 'Enter Postal Code',
          iconlabel: 'streetview icon',
          icon: 'streetview',
          model: undefined,
        },
        {
          label: 'Street',
          name: 'street',
          type: 'text',
          placeholder: 'Enter Street',
          iconlabel: 'streetview icon',
          icon: 'streetview',
          model: undefined,
        },
      ],
    };
  }
}
