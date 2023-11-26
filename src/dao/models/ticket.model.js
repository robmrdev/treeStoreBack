import mongoose from "mongoose";

const ticketCollection = 'tickets'

const ticketSchema = new mongoose.Schema({
    code: String,
    purchase_dateTime: Date,
    amount: Number,
    purchaser: String,
    products:[
        {_id:String,
        price:Number}
    ]
})

export const ticketModel = mongoose.model(ticketCollection, ticketSchema);