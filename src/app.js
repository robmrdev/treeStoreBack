import express from "express";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import productRouter from './routes/product.router.js'
import authRouter from './routes/auth.router.js'
import cartRouter from './routes/cart.router.js'
import userRouter from './routes/user.router.js'
import cors from "cors"
import session from "express-session";
import cookieParser from "cookie-parser";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import { originURL } from "./config/constants.js";
import errorHandler from './middlewares/errors/index.js'
import { addLogger } from "./utils/logger.js";

const PORT = 8080
const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({ origin: originURL, credentials: true }));
app.use(addLogger)

try {
    await mongoose.connect('mongodb+srv://robmrdev:83VBnd4D5JO1D4Yb@cardigancluster.kqxx3hg.mongodb.net/cardigansDB?retryWrites=true&w=majority')
} catch (error) {
    console.log(error.message)
}

app.use(session({
    store: MongoStore.create({
        client: mongoose.connection.getClient(),
        ttl: 3600
    }),
    secret: 'Coder47300',
    resave: true,
    saveUninitialized: true,
}))

app.use('/', productRouter);
app.use('/api/users', userRouter)
app.use('/api/auth', authRouter)
app.use('/api/carts', cartRouter)

app.use(errorHandler)

initializePassport();
app.use(passport.initialize())

app.listen(PORT, () => {
    console.log('Server on 8080')
})


