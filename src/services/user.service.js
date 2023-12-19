import {UsersManager} from "../dao/factory.js";
import { generateUser } from "../utils.js";

const userManager = new UsersManager()


const getUsersService = async () => await userManager.getAll();

const getUserByEmailService = async (email) =>  await userManager.getByEmail(email)

const newUserService = async (user) =>  await userManager.save(user)

const mockingProductsService = ()=> {
    let users =[];
    for(let i=0; i< 100; i++){
        users.push(generateUser())
    }
    return users
}

export {
    getUsersService,
    getUserByEmailService,
    newUserService,
    mockingProductsService
}

