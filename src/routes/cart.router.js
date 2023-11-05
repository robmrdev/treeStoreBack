import { Router } from "express";
import CartManager from "../dao/managers/cart.manager.js";
import ProductManager from "../dao/managers/product.manager.js";
import UsersManager from "../dao/managers/users.manager.js";
import jwt from 'jsonwebtoken'
import { PRIVATE_KEY_JWT } from "../config/constants.js";
import { generateToken } from "../utils.js";

const router = Router();
const cartManager = new CartManager();
const productManager = new ProductManager()
const userManager = new UsersManager


router.get('/', async (req, res) => {
    try {
        const carts = await cartManager.getAll();
        res.send({ status: 'succes', payload: carts });
    } catch (error) {
        res.status(500).send({ status: 'error', error: error.message });
    }
})

router.get('/:id', async (req, res) => {
    const { id } = req.params
    try {
        const result = await cartManager.getOne(id);
        res.send({ status: 'succes', payload: result })
    } catch (error) {
        res.status(500).send({ status: 'error', error: error.message });
    }
})

router.post('/', async (req, res) => {
    const { products = [] } = req.body;

    // if(typeof products !== 'array'){
    //     return res.status(400).send({status: 'error', error: 'products needs to be an Array'})
    // }
    try {
        const result = await cartManager.save({
            products
        });
        res.status(201).send({ status: 'succes', payload: result });
    } catch (error) {
        res.status(500).send({ status: 'error', error: error.message });
    }
})

router.delete('/deleteProduct/:cid/:id', async (req, res) => {
    const { cid, id } = req.params
    const result = await cartManager.delete(cid, id);
    const userEmail = (jwt.verify(req.cookies.accessTokenCookie,PRIVATE_KEY_JWT)).user.email
    const user = await userManager.getByEmail(userEmail)
    delete user.password;
    const accessToken = generateToken(user[0])
    res.cookie('accessTokenCookie', accessToken, { maxAge: 60 * 60 * 1000 }).send({ status: 'success' })
})


router.put('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params
    try {
        const userEmail = (jwt.verify(req.cookies.accessTokenCookie,PRIVATE_KEY_JWT)).user.email
        console.log(userEmail)
        const product = { product: { _id: pid } };
        const result = await cartManager.addProduct(cid, product);

        const productsById = await productManager.getOne(pid)
        if (productsById === "Not Found") {
            res.status(404).send({ error: 'Id Not Found' });
        }
        // const accessTokenCookie = req.cookies.accessTokenCookie;
        // const decoded = jwt.verify(accessTokenCookie,PRIVATE_KEY_JWT)
        // console.log(decoded.user.email);
        const user = await userManager.getByEmail(userEmail)
        delete user.password;
        const accessToken = generateToken(user[0])
        res.cookie('accessTokenCookie', accessToken, { maxAge: 60 * 60 * 1000 }).send({ status: 'success' })

    } catch (error) {
        console.error('Error al agregar un producto al carrito:', error);
        res.status(500).send({ error: 'Error al agregar un producto al carrito' });
    }
});

export default router;