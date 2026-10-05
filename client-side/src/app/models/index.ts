export * from './address';
export * from './clients';
export * from './events';
export * from './showrooms';
export * from './tickets';
export * from './users';

type BaseFieldInput = {
    label: string;
    name: string;
    type: string;
    placeholder?: string;
    iconlabel?: string;
    icon?: string;
}

export type FieldInput = BaseFieldInput & {
    inputs?: BaseFieldInput[];
}

export type Schema = "User" | "Agent" | "Event" | "Showroom" | "Ticket";