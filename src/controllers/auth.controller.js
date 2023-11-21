
import { loginService, registerService } from "../services/auth.service.js";
import { generateToken } from '../utils.js'


const register = async (req, res) => {
    try {
        const { firstName, lastName, age, email, password } = req.body;
        const user = await registerService(firstName, lastName, age, email, password)
        if (user === 'exists') return res.status(400).send({ status: 'error', message: 'User already exists' })
        if (user) {
            res.send({ status: 'success', message:'Register Ok' })
        } else {
            res.status(404).send({ status: 'error', message: 'Register Fails' });
        }
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const previousCart = req.cookies['provisionalCart']
        const user = await loginService(email, password, previousCart)
        if (user === 'invalid') return res.status(401).send({ status: 'error', message: 'Invalid credentials' }) 
        const accessToken = generateToken(user)
        res.send({ status: 'success', payload: accessToken });
    } catch (error) {
        res.status(500).send({ status: 'error', message: 'Login fail' })
    }
}

const getUser = (req, res) => {
    res.send({ status: 'success', payload: req.user })
}

export {
    register,
    login,
    getUser
}