import mongoose from "mongoose";

const usersCollection = 'users';

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: {
        type: String,
        required: true,
        // unique: true
    },
    age: Number,
    password: String,
    role: {
        type: String,
        default: 'user'
    },
    carts: {
        type: [
            {
                cart: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'carts'
                }
            }
        ],
        default: []
    }
});

userSchema.pre('find', function () {
    this.populate({
        path: 'carts.cart'
    });
})

const usersModel = mongoose.model(usersCollection, userSchema)

export default usersModel