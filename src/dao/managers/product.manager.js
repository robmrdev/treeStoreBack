import { productModel } from "../models/product.model.js";
import mongoose from "mongoose";

export default class ProductManager {
    constructor() {
        console.log('Working Products')
    }

    getOne = async (id) => {
        const product = await productModel.findById(id)
        return product
    }

    getAll = async () => {
        const products = await productModel.find()
        return products.map(product => product.toObject())
    }
    getOneByTittle = async (title) => {
        const spaceTittle = title.replace(/-/g, " ")
        const product = productModel.find({ title: spaceTittle })
        return product
    }
    save = async (product) => {
        const result = await productModel.create(product);
        return result;
    }
    addDesc = async (id, largeDescription) => {
        const product = await productModel.findOne({ _id: id });
        if (!product) {
            throw new Error('Producto no encontrado');
        }
        product.largeDescription = largeDescription;
        await product.save();
        return product;
    };
    update = async (id, cart) => {
        const result = await productModel.updateOne({ _id: id }, cart);
        return result
    }
    delete = async (id) => {
        const result = await productModel.deleteOne({ _id: id });
        return result
    }
}