import { Router } from "express";
import { getUser, getUserByEmail, mockingproducts, newUser } from "../controllers/user.controller.js";


const router = Router()

router.get('/getusers', getUser)

router.get('/getbyemail/:email', getUserByEmail)

router.post('/newuser/', newUser)

router.get('/mockingproducts', mockingproducts)

export default router;