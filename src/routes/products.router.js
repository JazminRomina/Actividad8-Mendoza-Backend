import express from 'express'
import productsModel from '../models/products.model.js'
import { ProductManager } from '../controllers/ProductManager.js'

const router = express.Router()
const ProdManager = new ProductManager()

router.get('/', async(req, res) => {
    try{
        const products = await ProdManager.getAllProdsViews(req)
        res.status(200).json(products.response)
    }
    catch(error){
        res.status(500).json('There is an error in the server.', error)
    }
})

router.get('/:pid', async(req, res) => {
    let pid = req.params.pid
    try{
        const productId = await productsModel.find({_id: pid})
        res.json(productId)
    }
    catch (error){
        res.status(500).json('There is an error with the ID / Item not Found.', error)
    }
})

router.post('/', async(req, res) => {
    const newProduct = req.body
    try{
        const product = new productsModel(newProduct)
        await product.save()
        res.send({message: 'This Product has been added', product: product})
    }
    catch(error){
        res.status(500).json('There is an error with adding this product.', error)
    }
})

router.put('/:pid', async(req,res) => {
    let pid = req.params.pid
    const prod = req.body
    try{
        await productsModel.updateOne({_id: pid},{$set: prod})
        res.send({message: 'This Product has been changed'})
    }
    catch(error){
        res.status(500).json('There is a problem with the change of the product.', error)
    }
})

router.delete('/:pid', async(req, res) => {
    let pid = req.params.pid
    try{
        await productsModel.deleteOne({_id: pid})
        res.send({message: 'This Product has been eliminated'})
    }
    catch(error){
        res.status(500).json('We could not delete the product.', error)
    }
})

export default router