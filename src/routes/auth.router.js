import { Router } from "express";
import passport from "passport";
import { authToken, generateToken } from "../utils.js";
import userModel from "../dao/models/users.model.js";
import UsersManager from "../dao/managers/users.manager.js";

const router = Router();
const userManager = new UsersManager

router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, age, email, password } = req.body;
        // const exists = userManager.getByEmail(email)
        // if (exists) return res.status(400).send({ status: 'error', message: 'User already exists' })
        const user = userManager.save({
            firstName,
            lastName,
            age,
            email,
            password
        })
        const accessToken = generateToken(user);
        if (user) {
            res.send({ status: 'success', access_token: accessToken })
        } else {
            res.status(404).send({ status: 'error', message: 'Register Fails' });
        }
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message })
    }
})

router.post('/login', async (req, res) => {
    try {
        console.log('logining in')
        const { email, password } = req.body;
        const users = await userManager.getAll()
        const user = users.find(user => user.email === email && user.password === password)

        if (!user) return res.status(401).send({ status: 'error', message: 'Invalid credentials' })
        delete user.password;
        const accessToken = generateToken(user)
        res.cookie('accessTokenCookie', accessToken, { maxAge: 60 * 60 * 1000, sameSite: 'None', secure: true}).send({ status: 'success' });
        console.log('logged')
    } catch (error) {
        res.status(500).send({ status: 'error', message: 'Login fail' })
    }
})

router.get('/user', passport.authenticate('current', { session: false }), (req, res) => {
    res.send({ status: 'success', payload: req.user })
})



export default router