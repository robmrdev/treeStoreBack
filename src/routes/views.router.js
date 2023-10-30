
import { Router } from "express";
import ProductManager from "../dao/managers/product.manager.js";

const router = Router()
const productManager = new ProductManager

router.get('/realTimeProducts', async (req,res)=>{
    const { page = 1, limit = 6, query = '', sort = ''} = req.query;
    
    let sortOption = {};
    if (sort === 'asc' || sort === 'desc') {
        sortOption = { price: sort === 'asc' ? 1 : -1 };
    } else {
        sortOption = {}; 
    }



    try {
        const queryObj = query ? { category: query } : {};

        const {docs, hasPrevPage, hasNextPage, nextPage, prevPage } = await productModel.paginate(queryObj, {limit, page, lean: true, sort: sortOption});
        
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
            const firstImg = Object.values(prod.thumbnail)[0][0];
            return {
                _id: prod._id,
                title: prod.title,
                description: prod.description,
                code: prod.code,
                price: prod.price,
                stock: prod.stock,
                category: prod.category,
                colorCode: prod.colorCode,
                colors: prod.color,
                color: firstImg,
            };
        });
    res.render('realtimeproducts', {
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
    })
    } catch (error) {
        console.error(error.message)
    }
})