import { cartModel } from "../models/cart.model.js"

export default class CartManager {
    constructor() {
        console.log('working carts with DB')
    }

    getAll = async () => {
        const carts = await cartModel.find().lean();
        return carts
    }

    getOne = async (id) => {
        const cart = await cartModel.findById(id)
        return cart
    }

    save = async (cart) => {
        const result = await cartModel.create(cart);
        return result;
    }
    // update = async (id, cart) => {
    //     const mappedCart = cart.map(item => ({
    //         product: item.product,
    //         color: item.color,
    //         price: item.price,
    //         title: item.title,
    //         quantity: item.quantity,
    //         thumbnail: item.thumbnail
    //     }));
    //     const result = await cartModel.updateOne({ _id: id }, { $set: { 'products': mappedCart } });
    //     return result
    // }

    update = async (id, cart) => {
        const result = await cartModel.updateOne({ _id: id }, { $set: { 'products': cart } });
        // console.log(`CAAAAAARRRRTT:`, cart)
        // console.log(`RESULT: `, result)
        return result;
    }

    // delete = async (cid, id) => {
    //     const cart = await this.getOne(cid);
    //     const itemIndex = cart.products.findIndex(product => product.product.toString() === id);
    //     if (itemIndex !== -1) {
    //         cart.products.splice(itemIndex, 1);
    //         await this.update(cid, cart);
    //         return `Item with id ${id} deleted from cart ${cid}`;
    //     } else {
    //         return `Item with id ${id} not found in cart ${cid}`;
    //     }
    // }
    // addProduct = async (cid, product) => {
    //     const cart = await this.getOne(cid);
    //     const existingProductIndex = cart.products.findIndex(p => p.product._id.equals(product.product._id));
    //     if (existingProductIndex === -1) {
    //         product.quantity = 1;
    //         cart.products.push(product);
    //     } else {
    //         cart.products[existingProductIndex].quantity = (cart.products[existingProductIndex].quantity || 1) + (product.quantity || 1);
    //     }
    //     await this.update(cid, cart);

    //     return `Product added to cart ${cid}`;
    // }
}