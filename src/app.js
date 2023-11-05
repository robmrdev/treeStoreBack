import express from "express";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import productRouter from './routes/product.router.js'
import authRouter from './routes/auth.router.js'
import cartRouter from './routes/cart.router.js'
import cors from "cors"
import session from "express-session";
import cookieParser from "cookie-parser";
import serverless from "serverless-http";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
// import { __dirname } from "./utils.js";
const PORT = 8080
const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({origin: 'http://localhost:5173',credentials: true})); /* al anadir {['http://XXXXX.com]} adentro del parametro de cors se bloquean las peticiones unicamente desde ese sitio*/
try {
    await mongoose.connect('mongodb+srv://robmrdev:83VBnd4D5JO1D4Yb@cardigancluster.kqxx3hg.mongodb.net/cardigansDB?retryWrites=true&w=majority')
    console.log('DB connected')
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
app.use('/api/auth', authRouter)
app.use('/api/carts', cartRouter)

initializePassport();
app.use(passport.initialize())

app.listen(PORT, ()=>{
    console.log('Server on 8080')
})


