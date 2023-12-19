import { getUserByEmailService, getUsersService, mockingProductsService, newUserService } from "../services/user.service.js";

const getUser = async (req, res) => {
    const users = getUsersService()
    try {
        res.send({ status: 'success', payload: users })
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message })
    }
}

const getUserByEmail = async (req, res) => {
    const email = req.params.email
    const user = getUserByEmailService(email)
    try {
        res.send({ status: 'success', payload: user })
    } catch (error) {
        res.status(500).send({ status: 'error', message: 'error' })
    }
}

const newUser = async (req, res) => {
    const user = req.body
    const newUser = newUserService(user)
    try {
        res.send({ status: 'success', payload: newUser })
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message })
    }
}

const mockingproducts = (req,res)=>{
    const users = mockingProductsService()
    res.send({status: 'success', payload: users})
}

export{
    getUser,
    getUserByEmail,
    newUser,
    mockingproducts
}