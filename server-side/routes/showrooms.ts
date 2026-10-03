export const showroomsInfo = {
    title: 'Showrooms',
    description: 'list of all showrooms',
    inputs: [
        {
            name: 'name',
            type: 'text',
            placeholder: 'name'
        },
        {
            name: 'capacity',
            type: 'number',
            placeholder: 'capacity'
        },
        {
            name: 'capacityLimit',
            type: 'number',
            placeholder: 'capacityLimit'
        },
        {
            name: 'street',
            type: 'text',
            placeholder: 'Enter the address'
        },
        {
            name: 'number',
            type: 'number',
            placeholder: 'Enter the number'
        },
        {
            name: 'postalCode',
            type: 'text',
            placeholder: 'Enter the postal code'
        },
        {
            name: 'country',
            type: 'text',
            placeholder: 'Enter the country'
        }
    ],
    keys: ['name', 'capacity', 'limit', 'address']
}