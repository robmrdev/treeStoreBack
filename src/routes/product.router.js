import { Router } from "express";
import { productModel } from "../dao/models/product.models.js";
import ProductManager from "../dao/managers/product.manager.js";


const router = Router()
const productManager = new ProductManager

router.put('/updatedesc/:id', async (req,res)=>{
    try {
        const {id} = req.params;
        const {largeDescription} = req.body;
        // console.log(id)
        const updatedProduct = await productManager.addDesc(id,largeDescription)
        if (updatedProduct) {
            res.send({ status: 'success', payload: updatedProduct });
          } else {
            res.status(404).send({ status: 'error', message: 'Producto no encontrado' });
          }
    } catch (error) {
        res.status(500).send({ status: 'error', message: 'Error en el servidor' });
    }
}),
router.get('/getproducts', async (req, res) => {
    const { page = 1, limit = 9999, query = '', sort = '', subCat = ''} = req.query;

    let sortOption = {};
    if (sort === 'asc' || sort === 'desc') {
        sortOption = { price: sort === 'asc' ? 1 : -1 };
    } else {
        sortOption = {};
    }
    const subCatRef = decodeURIComponent(subCat).replace(/_/g, " ").replace(/and/g, "&");
    try {
        const queryObj = query ? { category: query } : {};
        if (subCatRef != '') queryObj.subCategory = subCatRef
        const { docs, hasPrevPage, hasNextPage, nextPage, prevPage } = await productModel.paginate(queryObj, { limit, page, lean: true, sort: sortOption });

        function getCategories(products) {
            const categories = [];
            products.map((p) => {
                if (!categories.includes(p.category)) {
                    categories.push(p.category);
                }
            });
            return categories;
        }
        const products = await productManager.getAll();
        const allCategories = getCategories(products);
        const productData = docs.map(prod => {
            return {
                _id: prod._id,
                title: prod.title,
                description: prod.description,
                code: prod.code,
                price: prod.price,
                stock: prod.stock,
                category: prod.category,
                colorCode: prod.colorCode,
                color: prod.color,
                thumbnail: prod.thumbnail,
                subCategory: prod.subCategory
            };
        });
        const payload = {
            product: productData,
            user: req.session.user,
            page: page,
            hasPrevPage: hasPrevPage,
            hasNextPage: hasNextPage,
            nextPage: nextPage,
            prevPage: prevPage,
            limit: limit,
            query,
            sort,
            allCategories,
        }
        res.send({ status: 'succes', payload: payload })
    } catch (error) {
        console.error(error.message)
    }
})

router.get('/getProduct/:title',async (req,res)=>{
    const { title } = req.params
    const product = await productManager.getOneByTittle(title)
    try {
        res.send({ status: 'success', payload: product[0] })
    } catch (error) {
        console.error(error.message)
    }
})

router.get('/getAllProducts', async (req,res)=>{
    const products = await productManager.getAll();
    try {
        res.send({ status: 'success', payload: products })
    } catch (error) {
        console.error(error.message)
    }

})

router.post('/createProduct', async (req, res) => {
    const user = req.body;
    const newUser = new productModel(user);
    await newUser.save();
    res.json(user)
})

router.delete('/deleteProduct/:id', async (req, res) => {
    const { id } = req.params
    const result = await productManager.delete(id);
    res.send({ status: 'succes', payload: result })
})


export default router;