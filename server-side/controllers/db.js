import User from '../models/users.js';
import Event from '../models/events.js';
import Showroom from '../models/showrooms.js';
import Ticket from '../models/tickets.js';

class mongoDB {
    collection(schemaName) {
        switch (schemaName) {
            case 'users':
                return User;
            case 'events':
                return Event;
            case 'showrooms':
                return Showroom;
            case 'tickets':
                return Ticket;
            default:
                return null;
        }
    }
    async read(schemaName, key) {
        let schema = this.collection(schemaName);
        try {
            if(key) {
                return schema.findOne({_id:key});
            }
            else {
                return schema.find({});
            }
        }
        catch(e) {
            console.log('Erro: ', e);
        }
    }
    create(schemaName, body) {
        const Schema = this.collection(schemaName);
        return (new Schema(body)).save();
    }
    async update(schemaName, body, key) {
        let schema = this.collection(schemaName);
        await schema.findByIdAndUpdate(key, {$eq: body}, (err)=>{
            if (err){
                console.log('Erro a gravar', err);
            } else {
                console.log("Updated Successfully")
            }
        } )
    }
    delete(schemaName, key) {
        let schema = this.collection(schemaName);
        try {
            return schema.deleteOne({_id:key});
        }
        catch (err) {
            console.log('Erro', err);
            return Promise.reject()
        }
    }
}

export default new mongoDB;