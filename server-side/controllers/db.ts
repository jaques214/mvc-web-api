import type { Model, UpdateQuery } from 'mongoose';
import User, { type IUser, type IUserDocument } from '../models/users';
import Event, { type IEvent, type IEventDocument } from '../models/events';
import Showroom, { type IShowroom, type IShowroomDocument } from '../models/showrooms';
import Ticket, { type ITicket, type ITicketDocument } from '../models/tickets';

type SchemaModels = {
    users: Model<IUser, {}, {}, {}, IUserDocument>;
    events: Model<IEvent, {}, {}, {}, IEventDocument>;
    showrooms: Model<IShowroom, {}, {}, {}, IShowroomDocument>;
    tickets: Model<ITicket, {}, {}, {}, ITicketDocument>;
};

export type SchemaName = keyof SchemaModels;
type SchemaDocument = IUser & IEvent & IShowroom & ITicket;

const collections: SchemaModels = {
    users: User,
    events: Event,
    showrooms: Showroom,
    tickets: Ticket
};

const collection = <T extends SchemaName,>(schemaName: T): SchemaModels[T] => collections[schemaName];

const operationCollection = (schemaName: SchemaName): Model<SchemaDocument> => collection(schemaName) as unknown as Model<SchemaDocument>;

async function read<T extends SchemaName>(schemaName: T, key?: string) {
    const Schema = operationCollection(schemaName);
    const query = key ? Schema.findOne({ _id: key }) : Schema.find({});
    if (schemaName === 'users') query.select('-password');
    return await query;
}

function create<T extends SchemaName>(schemaName: T, body: Parameters<SchemaModels[T]['create']>[0]) {
    const Schema = collection(schemaName);
    return (new Schema(body)).save();
}

async function update(schemaName: SchemaName, body: UpdateQuery<SchemaDocument>, key: string) {
    const Schema = operationCollection(schemaName);
    await Schema.findByIdAndUpdate(key, body);
    console.log('Updated Successfully');
}

async function deleteRecord(schemaName: SchemaName, key: string) {
    const Schema = operationCollection(schemaName);
    return Schema.deleteOne({ _id: key });
}

const mongoDB = {
    read: async <T extends SchemaName>(schemaName: T, key?: string) => await read(schemaName, key),
    create: <T extends SchemaName>(schemaName: T, body: Parameters<SchemaModels[T]['create']>[0]) => create(schemaName, body),
    update: async (schemaName: SchemaName, body: UpdateQuery<SchemaDocument>, key: string) => await update(schemaName, body, key),
    delete: async (schemaName: SchemaName, key: string) => await deleteRecord(schemaName, key)
};

export default mongoDB;