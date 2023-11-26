import config from "../config/config.js";

let UsersManager;

const persistence = config.persistence

switch(persistence){
    case 'MONGO':
        console.log('Working on DB')
        const mongoose = await import('mongoose');
        await mongoose.connect(config.mongoURL);
        const {default: UsersMongo } = await import ('./managers/users.manager.js')
        UsersManager = UsersMongo
        break;

    case 'MEMORY':
        console.log('Working on MEMORY')
        const {default: UsersMemory } = await import ('./memory/users.manager.js')
        UsersManager = UsersMemory
        break;
}

export {
    UsersManager
}