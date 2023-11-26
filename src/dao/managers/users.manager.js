import usersModel from "../models/users.model.js";
import CartManager from "./cart.manager.js";


const cartManager = new CartManager

export default class UsersManager {
    constructor(){
        console.log('working users with DB')
    }

    getByEmail = async (email)=>{
        const user = await usersModel.find({email});
        return user[0]
    }

    // getByEmail = async (email) => {
    //     try {
    //       console.log(123);
    //       const user = await usersModel.find({ email });
    //       console.log(user);
    //       return user[0];
    //     } catch (error) {
    //       console.error('Error al buscar usuario por email:', error);
    //       throw error; // Puedes elegir manejar el error de alguna manera específica para tu aplicación
    //     }
    //   };

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