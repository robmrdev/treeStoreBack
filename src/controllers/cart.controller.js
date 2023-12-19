import { addOneProductToCartService, createOrder, deleteOneProductService, getAllCartsService, getOneCartService, haveStock, newCartService } from "../services/cart.service.js";
import { generateToken } from "../utils/utils.js";

const getAllCarts = async (req, res) => {
    try {
        const carts = await getAllCartsService();
        res.send({ status: 'succes', payload: carts });
    } catch (error) {
        res.status(500).send({ status: 'error', error: error.message });
    }
}
const getOneCart = async (req, res) => {
    const { id } = req.params
    try {
        const result = await getOneCartService(id)
        res.send({ status: 'succes', payload: result })
    } catch (error) {
        res.status(500).send({ status: 'error', error: error.message });
    }
}
const newCart = async (req, res) => {
    const { products = [] } = req.body;
    try {
        const result = await newCartService(products)
        res.status(201).send({ status: 'succes', payload: result });
    } catch (error) {
        res.status(500).send({ status: 'error', error: error.message });
    }
}

const deleteOneProduct = async (req, res) => {
    const { cid, id } = req.params
    const previousCart = req.cookies['provisionalCart']
    const authorizationHeader = req.headers['authorization'];
    if (!authorizationHeader) {
        return res.status(401).send({ status: 'error', message: 'Unauthorized' });
    }
    const user = await deleteOneProductService(cid, id, previousCart, authorizationHeader);
    // console.log(`USER:::  `,user)
    const accessToken = generateToken(user)
    res.send({ status: 'success', payload: accessToken });
}

const addOneProductToCart = async (req, res) => {
    const { cid, pid } = req.params
    const previousCart = req.cookies['provisionalCart']
    try {
        const authorizationHeader = req.headers['authorization'];
        if (!authorizationHeader) {
            return res.status(401).send({ status: 'error', message: 'Unauthorized' });
        }
        const stock = await haveStock(pid)
        if (!stock){
            return res.status(422).send({ status: 'error', message: 'Product not available'})
        }


        // const token = authorizationHeader.split(' ')[1];
        // const decodedToken = jwt.verify(token, PRIVATE_KEY_JWT);
        // const userEmail = decodedToken.user.email;

        // const productsById = getOneProductService(pid)
        // if (productsById === "Not Found") {
        //     res.status(404).send({ error: 'Id Not Found' });
        // }

        // const product = { product: { _id: pid } };
        // const result = await cartManager.addProduct(cid, product);
        // const user = await userManager.getByEmail(userEmail)
        // delete user.password;

        const user = await addOneProductToCartService(cid, pid, previousCart, authorizationHeader)
        const accessToken = generateToken(user)
        res.send({ status: 'success', payload: accessToken });
    } catch (error) {
        console.error('Error al agregar un producto al carrito:', error);
        res.status(500).send({ error: 'Error al agregar un producto al carrito' });
    }
}
const checkout =async (req,res)=>{
    try {
        const {cid} = req.params
        const {user} = req.body
        const newTicket = await createOrder(cid, user)
        res.send({status: 'success', payload: newTicket})
    } catch (error) {
        res.status(500).send({ error: 'Error at checkout' });
    }
}

export{
    getAllCarts,
    getOneCart,
    newCart,
    deleteOneProduct,
    addOneProductToCart,
    checkout
}