
import ProductManager from "../dao/managers/product.manager.js";
import { productModel } from "../dao/models/product.model.js";
const productManager = new ProductManager

const getOneProductByTittleService = async (title) => await productManager.getOneByTittle(title)

const getOneProductByIdService = async (id) => await productManager.getOne(id)

const getAllProductsService = async () => await productManager.getAll();

const createProductService = async (product) => await productManager.save(product) /* NOT SURE */

const deleteProductService = async (id) => await productManager.delete(id);

const updateDescService = async (id, largeDescription) => await productManager.addDesc(id, largeDescription)

const getProductsPaginatedService = async (user, page, limit, query, sort, subCat) => {

    let sortOption = {};
    if (sort === 'asc' || sort === 'desc') {
        sortOption = { price: sort === 'asc' ? 1 : -1 };
    } 
    else {
        sortOption = {};
    }
    const subCatRef = decodeURIComponent(subCat).replace(/_/g, " ").replace(/and/g, "&");

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
            user: user,
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
        return payload
}


export {
    getOneProductByTittleService,
    getOneProductByIdService,
    getAllProductsService,
    createProductService,
    deleteProductService,
    updateDescService,
    getProductsPaginatedService
}