import mongoose from "mongoose";

const cartsCollection = 'carts'

const cartSchema = new mongoose.Schema({
    products:{
        type: [
            {
                product:{
                    type: mongoose.Schema.Types.ObjectId,
                    // ref: 'products'
                },
                color: String,
                price: Number,
                thumbnail: String,
                title: String,
                quantity: {
                    type: Number,
                    default: 1
                }
            }
        ],
        default: []
    }
});

export const cartModel = mongoose.model(cartsCollection, cartSchema);