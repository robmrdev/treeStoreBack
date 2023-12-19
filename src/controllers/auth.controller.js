
import { loginService, registerService } from "../services/auth.service.js";
import { generateToken } from '../utils/utils.js'
import CustomError from "../middlewares/errors/CustomError.js";
import { generateUserErrorInfo, loginUserErrorInfo } from "../middlewares/errors/info.js";
import EErrors from "../middlewares/errors/enums.js";


const register = async (req, res) => {
        const { firstName, lastName, age, email, password } = req.body;
        if (!firstName || !lastName || !age || !email) {
            throw CustomError.createError({
                name: 'userError',
                cause: generateUserErrorInfo({
                    firstName,
                    lastName,
                    age,
                    email
                }),
                message: 'Error on Register User',
                code: EErrors.INVALID_TYPE_ERROR
            })
        }
        const user = await registerService(firstName, lastName, age, email, password)
        if (user === 'exists') return res.status(400).send({ status: 'error', message: 'User already exists' })
        if (user) {
            res.send({ status: 'success', message: 'Register Ok' })
        } else {
            res.status(404).send({ status: 'error', message: 'Register Fails' });
        }
    
}

const login = async (req, res) => {
    // try {
        const { email, password } = req.body;
        const previousCart = req.cookies['provisionalCart']
        const user = await loginService(email, password, previousCart)
        if (user === 'invalid') throw CustomError.createError({
            name: 'LoginError',
            cause: loginUserErrorInfo(),
            message: 'Error on Login User',
            code: EErrors.USER_NOT_FOUND
        })
        const accessToken = generateToken(user)
        res.send({ status: 'success', payload: accessToken });
    // } catch (error) {
    //     res.status(500).send({ status: 'error', message: 'Login fail' })
    // }
}

const getUser = (req, res) => {
    res.send({ status: 'success', payload: req.user })
}

export {
    register,
    login,
    getUser
}