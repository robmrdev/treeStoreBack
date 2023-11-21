import jwt from 'jsonwebtoken'
import UsersManager from "../dao/managers/users.manager.js";
import CartManager from "../dao/managers/cart.manager.js";
import { PRIVATE_KEY_JWT } from "../config/constants.js";
import { getOneProductByIdService } from './product.service.js';
const cartManager = new CartManager();
const userManager = new UsersManager();


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
    // console.log(`ID: ${product.product._id}`)
    // console.log(`CART: `, cart)
    // const existingProductIndex = cart.products.findIndex(p => p.product && p.product._id == (product.product._id));
    // console.log(`EXISTING PRODUCT: ${existingProductIndex}`)
    // if (existingProductIndex === -1) {
    //     product.quantity = 1;
    //     cart.products.push(product);
    // } else {
    //     cart.products[existingProductIndex].quantity = (cart.products[existingProductIndex].quantity || 1) + (product.quantity || 1);
    // }
    // console.log(`NEW CART ${cart}`)
    const newCart = JSON.parse(previousCart).products.map((e) => ({
        product: e._id,
        color: e.color,
        price: e.price,
        title: e.title,
        thumbnail: e.thumbnail,
        quantity: e.quantity,
    }));
    // console.log(`NEW CARTTT:`,newCart)
    await cartManager.update(cid, newCart);
    // await cartManager.addProduct(cid, product);
    const user = await userManager.getByEmail(userEmail)
    delete user.password;
    return user
}

export {
    getAllCartsService,
    getOneCartService,
    newCartService,
    deleteOneProductService,
    addOneProductToCartService
}