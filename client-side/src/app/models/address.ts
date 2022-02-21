export class Address {

    constructor(
        public _id?:string,
        public street?:string,
        public number?: number,
        public postalCode?: string,
        public country?: string
        ) {}

    static fields(){
        return {
            inputs: [
              {
                name: 'street',
                type: 'text',
                placeholder: 'Enter Street name',
                iconlabel: 'streetview icon',
                icon: 'streetview',
                model: undefined,
              },
              {
                name: 'number',
                type: 'text',
                placeholder: 'Enter Street number',
                iconlabel: 'streetview icon',
                icon: 'streetview',
                model: undefined,
              },
              {
                name: 'postal-code',
                type: 'text',
                placeholder: 'Enter Postal-code',
                iconlabel: 'place icon',
                icon: 'place',
                model: undefined,
              },
              {
                name: 'country',
                type: 'text',
                placeholder: 'Enter country',
                iconlabel: ' flag icon',
                icon: 'flag',
                model: undefined,
              }
        ]}
    }
}