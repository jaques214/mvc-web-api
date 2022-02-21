import { Showroom } from './showrooms';

class SessionObj {
  constructor(
    public date?: Date, 
    public startTime?: Date,
    public endTime?: Date
    ) {}
  }
  
export class Event {
  
  constructor(
    public _id?: string,
    public title?: string,
    public poster?: File,
    public description?: string,
    public showroom?: Showroom,
    public promoter?: string,
    public minimumAge?: number,
    public saleStartDate?: Date,
    public saleEndDate?: Date,
    public tickets?: any[],
    public price?: number,
    public sessions?: SessionObj[],
  ) {}

  static fields() {
    return {
      inputs: [
        {
          label: 'Title',
          name: 'title',
          type: 'text',
          placeholder: 'Enter Title',
          iconlabel: 'account circle icon',
          icon: 'account_circle',
          model: undefined,
        },
        {
          label: 'Price',
          name: 'price',
          type: 'number',
          placeholder: 'Enter Price',
          iconlabel: 'Euro Symbol',
          icon: 'euro_symbol',
          model: undefined,
        },
        {
          label: 'Description',
          name: 'description',
          type: 'text',
          placeholder: 'Enter Description',
          iconlabel: 'description icon',
          icon: 'description',
          model: undefined,
        },
        {
          label: 'Showroom',
          name: 'showroom',
          type: 'text',
          placeholder: 'Choose Showroom',
          iconlabel: 'event seat icon',
          icon: 'event_seat',
          model: undefined,
        },
        {
          label: 'Promoter',
          name: 'promoter',
          type: 'text',
          placeholder: 'Enter promoter name',
          iconlabel: 'account circle icon',
          icon: 'account_circle',
          model: undefined,
        },
        {
          label: 'Minimum Age',
          name: 'minimumAge',
          type: 'number',
          placeholder: 'Enter minimum age',
          iconlabel: 'minimum age icon',
          icon: 'accessibility',
          model: undefined,
        },
        Event.dateFields()
      ],
    };
  }

  static dateFields() {
    return {
      label: 'Date of Sale',
      name: 'salesDates',
      type: 'date-range',
      inputs: [
        {
          name: 'saleStartDate',
          type: 'date',
          placeholder: 'Choose sale start date',
          model: undefined,
        },
        {
          name: 'saleEndDate',
          type: 'date',
          placeholder: 'Choose sale end date',
          model: undefined,
        },
      ],
    };
  }

  static sessionFields(){
    return {
      name: 'session',
      type: 'complex',
      inputs:[
        {
          label: 'Date',
          name: 'date',
          type: 'date',
          placeholder: 'Choose session date',
          model: undefined,
        },
        {
          label: 'Time Period',
          name: 'time',
          type: 'time-range',
          inputs:[
            {
              name: 'startTime',
              type: 'time',
              placeholder: 'Choose session startTime',
              model: undefined,
            },
            {
              name: 'endTime',
              type: 'time',
              placeholder: 'Choose session endTime',
              model: undefined,
            },
          ]
        },
      ]
    }
  }
}
