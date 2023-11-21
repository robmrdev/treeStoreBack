import { createProductService, deleteProductService, getAllProductsService, getOneProductByIdService, getOneProductByTittleService, getProductsPaginatedService, updateDescService } from "../services/product.service.js";


const getProductsPaginated = async (req, res) => {
    const { page = 1, limit = 9999, query = '', sort = '', subCat = '' } = req.query;
    const user = req.session.user
    try {
        const payload = await getProductsPaginatedService(user, page, limit, query, sort, subCat)
        res.send({ status: 'succes', payload: payload })
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message })
    }
}

const getOneProductByTittle = async (req, res) => {
    const { title } = req.params
    const product = await getOneProductByTittleService(title)
    try {
        res.send({ status: 'success', payload: product[0] })
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message })
    }
}

const getAllProducts = async (req, res) => {
    const products = await getAllProductsService();
    try {
        res.send({ status: 'success', payload: products })
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message })
    }
}

const createProduct = async (req, res) => {
    const product = req.body;
    const newProduct = createProductService(product)
    try {
        res.send({status: 'success', payload: newProduct})
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message })
    }
    // const newUser = new productModel(product);
    // await newUser.save();
    // res.json(product)
}

const getOneProductById = async (req, res) => {
    const { id } = req.params
    const product = await getOneProductByIdService(id)
    try {
        res.send({ status: 'success', payload: product })
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message })
    }
}

const deleteProduct = async (req, res) => {
    const { id } = req.params
    const result = await deleteProductService(id);
    try {
        res.send({ status: 'succes', payload: result })
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message })
    }
}

const updateDesc = async (req, res) => {
    try {
        const { id } = req.params;
        const { largeDescription } = req.body;
        const updatedProduct = await updateDescService(id, largeDescription)
        if (updatedProduct) {
            res.send({ status: 'success', payload: updatedProduct });
        } else {
            res.status(404).send({ status: 'error', message: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).send({ status: 'error', message: 'Error on server side' });
    }
}

export {
    getProductsPaginated,
    getOneProductByTittle,
    getAllProducts,
    createProduct,
    getOneProductById,
    deleteProduct,
    updateDesc
}