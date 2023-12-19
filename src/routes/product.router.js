import { Router } from "express";
import { createProduct, deleteProduct, getAllProducts, getOneProductById, getOneProductByTittle, getProductsPaginated, loggerTest, updateDesc } from "../controllers/product.controller.js";


const router = Router()

router.get('/getproducts', getProductsPaginated)

router.get('/getProduct/:title', getOneProductByTittle)

router.get('/getAllProducts', getAllProducts)

router.post('/createProduct', createProduct)

router.get('/productById/:id', getOneProductById)

router.delete('/deleteProduct/:id', deleteProduct)

router.put('/updatedesc/:id', updateDesc)

router.get('/loggerTest', loggerTest)

export default router;