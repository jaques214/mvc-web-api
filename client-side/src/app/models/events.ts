import type { Showroom } from './showrooms';
import type { Ticket } from './tickets';

type SessionObj = {
  date?: Date;
  startTime?: Date;
  endTime?: Date;
};

export type Event = {
  _id?: string;
  title?: string;
  poster?: File;
  description?: string;
  showroom?: Showroom;
  promoter?: string;
  minimumAge?: number;
  saleStartDate?: Date;
  saleEndDate?: Date;
  tickets?: Ticket[];
  price?: number;
  sessions?: SessionObj[];
}

export const eventFields = () => [
  {
    label: 'Title',
    name: 'title',
    type: 'text',
    placeholder: 'Enter Title',
    iconlabel: 'account circle icon',
    icon: 'account_circle',
  },
  {
    label: 'Price',
    name: 'price',
    type: 'number',
    placeholder: 'Enter Price',
    iconlabel: 'Euro Symbol',
    icon: 'euro_symbol',
  },
  {
    label: 'Description',
    name: 'description',
    type: 'text',
    placeholder: 'Enter Description',
    iconlabel: 'description icon',
    icon: 'description',
  },
  {
    label: 'Showroom',
    name: 'showroom',
    type: 'text',
    placeholder: 'Choose Showroom',
    iconlabel: 'event seat icon',
    icon: 'event_seat',
  },
  {
    label: 'Promoter',
    name: 'promoter',
    type: 'text',
    placeholder: 'Enter promoter name',
    iconlabel: 'account circle icon',
    icon: 'account_circle',
  },
  {
    label: 'Minimum Age',
    name: 'minimumAge',
    type: 'number',
    placeholder: 'Enter minimum age',
    iconlabel: 'minimum age icon',
    icon: 'accessibility',
  },
  dateFields()
];

const dateFields = () => ({
  label: 'Date of Sale',
  name: 'salesDates',
  type: 'date-range',
  inputs: [
    {
      label: 'Sale Start Date',
      name: 'saleStartDate',
      type: 'date',
      placeholder: 'Choose sale start date',
    },
    {
      label: 'Sale End Date',
      name: 'saleEndDate',
      type: 'date',
      placeholder: 'Choose sale end date',
    },
  ],
});

export const sessionFields = () => {
  return {
    name: 'session',
    type: 'complex',
    inputs: [
      {
        label: 'Date',
        name: 'date',
        type: 'date',
        placeholder: 'Choose session date',
      },
      {
        label: 'Time Period',
        name: 'time',
        type: 'time-range',
        inputs: [
          {
            name: 'startTime',
            type: 'time',
            placeholder: 'Choose session startTime',
          },
          {
            name: 'endTime',
            type: 'time',
            placeholder: 'Choose session endTime',
          },
        ]
      },
    ]
  }
}
