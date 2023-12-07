import UsersManager from "../dao/managers/users.manager.js";
import CartManager from "../dao/managers/cart.manager.js";
import { usersRepository } from "../repositories/index.js";

const userManager = new UsersManager
const cartManager = new CartManager();

const registerService = async (firstName, lastName, age, email, password) => {
    const exists = await userManager.getByEmail(email)
    let user
    if (exists == undefined) {
        user = await usersRepository.createUser({
            firstName,
            lastName,
            age,
            email,
            password
        })
    } else {
        user = 'exists'
    }
    return user
}

// const loginService = async (email, password, previousCart)=> {
//     const users = await userManager.getAll()
//     const user = users.find(user => user.email === email && user.password === password)
//     if (!user) return 'invalid'
//     if (previousCart !== undefined && previousCart !== '{"products":[]}') {
//         const newCart = JSON.parse(previousCart).products.map((e) => ({
//             product: e._id,
//             color: e.color,
//             price: e.price,
//             title:e.title,
//             thumbnail: e.thumbnail,
//             quantity: e.quantity,
//         }));
//         user.carts[0].cart.products = newCart;
//         // user.carts[0].cart.products = JSON.parse(previousCart).products
//         // const newCart = []
//         // JSON.parse(previousCart).products.forEach(e => {
//         //     newCart.push({product: e._id, quantity:e.quantity})
//         // });
//         if (newCart.length > 0) {
//             console.log(user.carts[0].cart._id)
//             await cartManager.update(user.carts[0].cart._id, newCart);
//         }
//         // console.log(user.carts[0].cart._id)
//         // await cartManager.update(user.carts[0].cart._id, newCart)
//     }
//     delete user.password;
//     return user
// }

const loginService = async (email, password, previousCart) => {
    const users = await userManager.getAll()
    let user = users.find(user => user.email === email && user.password === password)
    if (!user) return 'invalid'
    if (previousCart !== undefined && previousCart !== '{"products":[]}') {
        const newCart = JSON.parse(previousCart).products.map((e) => ({
            product: e._id,
            color: e.color,
            price: e.price,
            title: e.title,
            thumbnail: e.thumbnail,
            quantity: e.quantity,
        }));
        if (newCart.length > 0) {
            // console.log(`NEW: ${JSON.stringify(newCart)}`)
            await cartManager.update(user.carts[0].cart._id, newCart);
            user = await userManager.getByEmail(email)
        }
    }
    delete user.password;
    return user;
}

export {
    registerService,
    loginService
}