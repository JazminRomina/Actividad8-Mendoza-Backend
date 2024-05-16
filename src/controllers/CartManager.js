import cartsModel from "../models/carts.model.js"
import productsModel from "../models/products.model.js"

export class CartManager{
    addProductToTheCart = async(cid, pid) => {
        let cartIdInDB = await cartsModel.findById(cid)
        let productIdInDB = await productsModel.findById(pid)
        if(!cartIdInDB){
            return 'Cart not found'
        }
        if(!productIdInDB){
            return 'Product not found'
        }
        const productIndex = cartIdInDB.products.findIndex((p) => p.product._id.toString() === pid)
        if(productIndex !== -1){
            cartIdInDB.products[productIndex].quantity += 1
        }
        else{
            cartIdInDB.products.push({
                product: pid,
                quantity: 1
            })
        }
        await cartIdInDB.save()
    }

    deleteaProductFromTheCart = async (cid, pid) => {
        let cartIdInDB = await cartsModel.findById(cid)
        let productIdInDB = await productsModel.findById(pid)
        if(!cartIdInDB){
            return 'Cart not found'
        }
        if(!productIdInDB){
            return 'Product not found'
        }
        const findPositionProduct = cartIdInDB.products.findIndex((p) => p.product._id.toString() === pid)
        if (findPositionProduct !== -1) {
            cartIdInDB.products.splice(findPositionProduct, 1)
            await cartIdInDB.save()
        }
        else{
            return 'we did not found that product'
        }
    }

    updateProductsFromCart = async (cid,prods) => {
        let cartIdInDB = await cartsModel.findById(cid)
        if(!cartIdInDB){
            return 'Cart not found'
        }
        prods.forEach(product => {
            const prodIndexCart = cartIdInDB.products.findIndex((p) => p.product._id.toString() === product.product)
            if(prodIndexCart !== -1){
                cartIdInDB.products[prodIndexCart].quantity = product.quantity
            }
            else{
                cartIdInDB.products.push({
                    product: product.product,
                    quantity: product.quantity
                })
            }
        })
        await cartIdInDB.save()
    }

    updateQuantity = async (cid, pid, quantityProd) => {
        let cartIdInDB = await cartsModel.findById(cid)
        let productIdInDB = await productsModel.findById(pid)
        if(!cartIdInDB){
            return 'Cart not found'
        }
        if(!productIdInDB){
            return 'Product not found'
        }
        const prodIndexCart = cartIdInDB.products.findIndex((p) => p.product._id.toString() === pid)
        if(prodIndexCart !== -1){
            cartIdInDB.products[prodIndexCart].quantity = quantityProd.quantity
            await cartIdInDB.save()
        }
    }

    deleteAllProdsInTheCart = async(cid) => {
        let cartIdInDB = await cartsModel.findById(cid)
        if(!cartIdInDB){
            return 'Cart not found'
        }
        else{
            cartIdInDB.products = []
            await cartIdInDB.save()
        }
    }

    getCartById = async(cid) => {
        const idCart = await cartsModel.findOne({_id: cid}).lean()
        return idCart
    }
}