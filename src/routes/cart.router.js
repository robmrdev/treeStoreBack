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

    const authorizationHeader = req.headers['authorization'];
    if (!authorizationHeader) {
        return res.status(401).send({ status: 'error', message: 'Unauthorized' });
    }
    const token = authorizationHeader.split(' ')[1];
    const decodedToken = jwt.verify(token, PRIVATE_KEY_JWT);
    const userEmail = decodedToken.user.email;
    const user = await userManager.getByEmail(userEmail)
    delete user.password;
    const accessToken = generateToken(user[0])
    res.send({ status: 'success', payload: accessToken });
})


router.put('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params
    try {


        const authorizationHeader = req.headers['authorization'];
        if (!authorizationHeader) {
            return res.status(401).send({ status: 'error', message: 'Unauthorized' });
        }
        const token = authorizationHeader.split(' ')[1];
        const decodedToken = jwt.verify(token, PRIVATE_KEY_JWT);
        const userEmail = decodedToken.user.email;

        const productsById = await productManager.getOne(pid)
        if (productsById === "Not Found") {
            res.status(404).send({ error: 'Id Not Found' });
        }


        const product = { product: { _id: pid } };
        const result = await cartManager.addProduct(cid, product);
        console.log(`result: ${result}`)
        // const accessTokenCookie = req.cookies.accessTokenCookie;
        // const decoded = jwt.verify(accessTokenCookie,PRIVATE_KEY_JWT)
        // console.log(decoded.user.email);
        const user = await userManager.getByEmail(userEmail)
        console.log(user)
        delete user.password;
        const accessToken = generateToken(user[0])
        res.send({ status: 'success', payload: accessToken });

    } catch (error) {
        console.error('Error al agregar un producto al carrito:', error);
        res.status(500).send({ error: 'Error al agregar un producto al carrito' });
    }
});

export default router;