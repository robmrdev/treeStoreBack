import { Router } from "express";
import {UsersManager} from "../dao/factory.js";

/* ESTE ROUTER ES UNICAMENTE PARA PROBAR CAMBIO ENTRE MEMORY Y DB */

const router = Router()
const userManager = new UsersManager()

router.get('/getusers', async (req, res) => {
    const users = await userManager.getAll();
    try {
        res.send({ status: 'success', payload: users })
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message })
    }
})

router.get('/getbyemail/:email', async (req, res) => {
    const email = req.params.email
    console.log(`EMAIL: `, email)
    const user = await userManager.getByEmail(email)
    try {
        res.send({ status: 'success', payload: user })
    } catch (error) {
        res.status(500).send({ status: 'error', message: 'error' })
    }
})

router.post('/newuser/', async (req, res) => {
    const user = req.body
    const newUser = await userManager.save(user)
    try {
        res.send({ status: 'success', payload: newUser })
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message })
    }
})

export default router;