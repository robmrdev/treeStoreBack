import jwt from 'jsonwebtoken'
import UsersManager from "../dao/managers/users.manager.js";
import CartManager from "../dao/managers/cart.manager.js";
import TicketManager from '../dao/managers/ticket.manager.js';
import ProductManager from '../dao/managers/product.manager.js';
import { PRIVATE_KEY_JWT } from "../config/constants.js";
import { getOneProductByIdService } from './product.service.js';

const productManager = new ProductManager
const cartManager = new CartManager();
const userManager = new UsersManager();
const ticketManager = new TicketManager();


const getAllCartsService = async () => await cartManager.getAll();

const getOneCartService = async (id) => cartManager.getOne(id);

const newCartService = async (products) => await cartManager.save({
    products
});

// const deleteOneProductService = async (cid, id, color, authorizationHeader) => {
//     const cart = await cartManager.getOne(cid);
//     const itemIndex = cart.products.findIndex(product => product.product.toString() === id);
//     if (itemIndex !== -1) {
//         cart.products.splice(itemIndex, 1);
//         await cartManager.update(cid, cart);
//     }
//     const token = authorizationHeader.split(' ')[1];
//     const decodedToken = jwt.verify(token, PRIVATE_KEY_JWT);
//     const userEmail = decodedToken.user.email;
//     const user = await userManager.getByEmail(userEmail)
//     delete user.password;
//     return user
// }

const deleteOneProductService = async (cid, id, previousCart, authorizationHeader) => {
    // const newCart = JSON.parse(cart).products.map((e) => ({
    //     product: e._id,
    //     color: e.color,
    //     price: e.price,
    //     title:e.title,
    //     thumbnail: e.thumbnail,
    //     quantity: e.quantity,
    // }));
    // console.log(`PREVIOUS CART DELETE: `, previousCart)
    const token = authorizationHeader.split(' ')[1];
    // console.log(`TOKEN: `, token)
    const decodedToken = jwt.verify(token, PRIVATE_KEY_JWT);
    // console.log(`DECODED:`, decodedToken)
    const userEmail = decodedToken.user.email;
    let user = await userManager.getByEmail(userEmail);
    if (previousCart !== undefined && previousCart !== '{"products":[]}') {
        const newCart = JSON.parse(previousCart).products.map((e) => ({
            product: e._id,
            color: e.color,
            price: e.price,
            title: e.title,
            thumbnail: e.thumbnail,
            quantity: e.quantity,
        }));
        // console.log(`NEW: ${JSON.stringify(newCart)}`)
        await cartManager.update(cid, newCart);

    }

    // console.log(`NEW CART DELETE: `, newCart)


    // const filteredProducts = cart.products.filter(product => {
    //     return product.product.toString() === id && product.color === color;
    // });

    // if (filteredProducts.length > 0) {
    //     const itemIndex = cart.products.indexOf(filteredProducts[0]);
    //     cart.products.splice(itemIndex, 1);
    // }

    user = await userManager.getByEmail(userEmail);
    delete user.password;
    return user;
};
const addOneProductToCartService = async (cid, pid, previousCart, authorizationHeader) => {
    const token = authorizationHeader.split(' ')[1];
    const decodedToken = jwt.verify(token, PRIVATE_KEY_JWT);
    const userEmail = decodedToken.user.email;
    const productsById = getOneProductByIdService(pid)
    if (productsById === "Not Found") {
        res.status(404).send({ error: 'Id Not Found' });
    }
    const product = { product: { _id: pid } };
    const cart = await cartManager.getOne(cid);
    const newCart = JSON.parse(previousCart).products.map((e) => ({
        product: e._id,
        color: e.color,
        price: e.price,
        title: e.title,
        thumbnail: e.thumbnail,
        quantity: e.quantity,
    }));
    await cartManager.update(cid, newCart);
    const user = await userManager.getByEmail(userEmail)
    delete user.password;
    return user
}

const haveStock = async (id)=> {
    const product = await productManager.getOne(id)
    if (product.stock > 0) return true
    else if(product.stock <=0){
        return false
    }
}

const createOrder = async (cid,user) =>{

    const currentProducts = await cartManager.getOne(cid)
    let totalprice = 0
    currentProducts.products.forEach(item => {
        totalprice += item.price * item.quantity;
        haveStock(item.product)
    });
    const orderNumber = Date.now() + Math.floor(Math.random()* 100000 +1)
    const orderDate = new Date()
    const order = {
        code: orderNumber,
        purchase_dateTime: orderDate,
        purchaser: user.email,
        amount: totalprice,
        products: currentProducts.products
    }
    const newTicket = await ticketManager.save(order)
    return newTicket
}

export {
    getAllCartsService,
    getOneCartService,
    newCartService,
    deleteOneProductService,
    addOneProductToCartService,
    createOrder,
    haveStock
}