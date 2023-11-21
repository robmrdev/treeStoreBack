import usersModel from "../models/users.model.js";
import CartManager from "./cart.manager.js";


const cartManager = new CartManager

export default class UsersDBManager {
    constructor(){
        console.log('working users with DB')
    }

    getByEmail = async(email)=>{
        const user = await usersModel.find({email}).lean();
        return user[0]
    }
    getAll = async ()=>{
        const users = await usersModel.find()
        return users.map(user=>user.toObject())
    }
    save =  async(user)=>{
        const newCart = (await cartManager.save()).toObject()
        if (!user.carts) {
            user.carts = [];
        }
        user.carts.push({ cart: newCart._id });
        const result = await usersModel.create(user)
        return result
    }

}