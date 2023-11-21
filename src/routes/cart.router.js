import { Router } from "express";
import { addOneProductToCart, deleteOneProduct, getAllCarts, getOneCart, newCart } from "../controllers/cart.controller.js";

const router = Router();


router.get('/', getAllCarts)

router.get('/:id', getOneCart)

router.post('/', newCart)

router.delete('/deleteProduct/:cid/:id/', deleteOneProduct)


router.put('/:cid/products/:pid', addOneProductToCart);

export default router;