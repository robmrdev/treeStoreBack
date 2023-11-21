import { Router } from "express";
import { createProduct, deleteProduct, getAllProducts, getOneProductById, getOneProductByTittle, getProductsPaginated, updateDesc } from "../controllers/product.controller.js";


const router = Router()

router.get('/getproducts', getProductsPaginated)

router.get('/getProduct/:title', getOneProductByTittle)

router.get('/getAllProducts', getAllProducts)

router.post('/createProduct', createProduct)

router.get('/productById/:id', getOneProductById)

router.delete('/deleteProduct/:id', deleteProduct)

router.put('/updatedesc/:id', updateDesc)

export default router;