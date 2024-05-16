import productsModel from "../models/products.model.js"

export class ProductManager{
    getProds = async() => {
        const products = await productsModel.find()
    }

    addProducts = async(data) => {
        const product = new productsModel(data)
        await product.save()
    }

    deleteProduct = async(pid) => {
        return await productsModel.findByIdAndDelete(pid)
    }

    findProductByCode = async(code) => {
        const codeProd = await productsModel.findOne({code: code})
        return codeProd
    }

    getAllProdsViews = async(req) => {
        let limit = req.query.limit || 10
        let page = req.query.page || 1

        const filterOptions = {}
        if(req.query.stock) filterOptions.stock = req.query.stock
        if(req.query.category) filterOptions.category = req.query.category
        const paginateOptions = {lean: true, limit, page}
        if(req.query.sort === 'asc') paginateOptions.sort = {price: 1}
        if(req.query.sort === 'desc') paginateOptions.sort = {price: -1}
        const result = await productsModel.paginate(filterOptions, paginateOptions)
        let prevLink
        if(!req.query.page){
            prevLink = `http://localhost:8080${req.originalUrl}?limit=${limit}&page=${result.prevPage}`
        }else{
            const modifiedUrl = req.originalUrl.replace(`page=${req.query.page}`, `page=${result.prevPage}`)
            prevLink = `http://localhost:8080${modifiedUrl}`
        }
        let nextLink
        if(!req.query.page) {
            nextLink = `http://localhost:8080${req.originalUrl}?limit=${limit}&page=${result.nextPage}`
        } else{
            const modifiedUrl = req.originalUrl.replace(`page=${req.query.page}`, `page=${result.nextPage}`)
            nextLink = `http://localhost:8080${modifiedUrl}`
        }
        return {
            statusCode: 200,
            response: {
                status: 'success',
                payload: result.docs,
                totalPages: result.totalPages,
                prevPage: result.prevPage,
                nextPage: result.nextPage,
                page: result.page,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevLink: result.hasPrevPage ? prevLink : null,
                nextLink: result.hasNextPage ? nextLink : null
            }
        }
    }
}