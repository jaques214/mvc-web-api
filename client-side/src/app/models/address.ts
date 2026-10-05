export type Address = {
  _id: string,
  street: string,
  number: number,
  postalCode: string,
  country: string
}

export const addressFields = () => [
  {
    label: 'Street',
    name: 'street',
    type: 'text',
    placeholder: 'Enter Street name',
    iconlabel: 'streetview icon',
    icon: 'streetview',
  },
  {
    label: 'Number',
    name: 'number',
    type: 'text',
    placeholder: 'Enter Street number',
    iconlabel: 'streetview icon',
    icon: 'streetview',
  },
  {
    label: 'PostalCode',
    name: 'postalCode',
    type: 'text',
    placeholder: 'Enter Postal-code',
    iconlabel: 'place icon',
    icon: 'place',
  },
  {
    label: 'Country',
    name: 'country',
    type: 'text',
    placeholder: 'Enter country',
    iconlabel: ' flag icon',
    icon: 'flag',
  }
];