import { fileURLToPath } from 'url';
import { dirname } from 'path';
import jwt from 'jsonwebtoken'
import { PRIVATE_KEY_JWT } from '../config/constants.js';
import { fakerEN_US as faker } from '@faker-js/faker'
// import bcrypt from 'bcrypt'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const generateToken = (user) => {
    const token = jwt.sign({ user }, PRIVATE_KEY_JWT, { expiresIn: '24h' })
    return token
}

const authToken = (req, res, next) => {
    const authToken = req.headers.authorization;
    if (!authToken) return res.status(401).send({ status: 'error', message: 'Not Authenticate' })

    const token = authToken.split(' ')[1]

    jwt.verify(token, PRIVATE_KEY_JWT, (error, credentials) => {
        if (error) return res.status(403).send({ status: 'error', message: 'Not Authorized' })
        req.user = credentials.user;
        next();
    })
}

const generateUser = () => {
    const numberOfProducts = faker.number.int({ min: 1, max: 5 });
    let products = [];
    for (let i = 0; i < numberOfProducts; i++) {
        products.push(generateProducts())
    }
    return {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        age: faker.number.int({min: 18, max: 100}),
        password: faker.internet.password(),
        role:  'user',
        carts: {
            _id:faker.database.mongodbObjectId(),
            products: products
        }
    }
}
const generateProducts = () => {
        return {
            product: faker.database.mongodbObjectId(),
            color: faker.vehicle.color(),
            price: faker.number.int({min: 20, max: 150}),
            thumbnail: faker.image.urlPlaceholder({format: 'webp', width: 200, height: 200}),
            title: faker.commerce.productName(),
            quantity: faker.number.int({min:1, max:10}),
            _id: faker.database.mongodbObjectId()
        }
}
// const createHash = password =>
//     bcrypt.hashSync(password, bcrypt.genSaltSync(10));

// const isValidPassword = (plainPassword, hashedPassword)=>
//     bcrypt.compareSync(plainPassword, hashedPassword);

export {
    generateToken,
    authToken,
    generateUser,
    // createHash,
    // isValidPassword,
    __dirname
}