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
    update = async (id, cart) => {
        const result = await cartModel.updateOne({ _id: id }, cart);
        return result
    }
    delete = async (cid, id) => {
        const cart = await this.getOne(cid);
        // Buscar el índice del producto en el carrito que tiene el mismo id que se quiere eliminar.
        const itemIndex = cart.products.findIndex(product => product.product.toString() === id);
        if (itemIndex !== -1) {
            // Si se encuentra el producto en el carrito, lo eliminamos.
            // console.log(cart.products.splice(itemIndex, 1))
            cart.products.splice(itemIndex, 1);
            // Luego, actualizamos el carrito en la base de datos.
            const result = await this.update(cid, cart);
    
            return `Item with id ${id} deleted from cart ${cid}`;
        } else {
            // Si no se encuentra el producto, puedes manejar un error o enviar un mensaje adecuado.
            return `Item with id ${id} not found in cart ${cid}`;
        }
    }
    addProduct = async (cid, product) => {
        // const cart= await this.getOne(cid)
        // const existingProductIndex = cart.products.findIndex(p => p.product._id === product.product._id);

        //     if (existingProductIndex === -1) {
        //         cart.products.push(product)
        //     } else {
        //         cart.products[existingProductIndex].quantity += product.quantity;
        //     }

        //     await this.update(cid, cart );
        //     return `Product added to cart ${cid}`;
        const cart = await this.getOne(cid);
        const existingProductIndex = cart.products.findIndex(p => p.product._id.equals(product.product._id));
        if (existingProductIndex === -1) {
            // El producto no existe en el carrito, así que lo agregamos.
            product.quantity = 1; // Inicializamos la cantidad a 1.
            cart.products.push(product);
        } else {
            // El producto ya existe en el carrito, actualizamos la cantidad.
            cart.products[existingProductIndex].quantity = (cart.products[existingProductIndex].quantity || 1) + (product.quantity || 1);
        }

        const result = await this.update(cid, cart);

        return `Product added to cart ${cid}`;
    }
}