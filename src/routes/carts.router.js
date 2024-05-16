import express from 'express'
import cartsModel from '../models/carts.model.js'
import {CartManager} from '../controllers/CartManager.js'

const router = express.Router()
const cartManager = new CartManager()

router.post('/', async(req, res) => {
    try{
        const cart = await cartsModel.create({products: []})
        res.send({message: 'There is a new cart', cart})
    }
    catch(error){
        res.status(500).json({error: 'ID Not found.'})
    }
})

router.get('/:id', async(req, res) => {
    let id = req.params.id
    try{
        const cartFound = await cartsModel.findOne({_id: id})
        res.json(cartFound)
    }
    catch(error){
        res.status(500).json('There is an error in the server.')
    }
})

router.post('/:cid/product/:pid', async(req, res) => {
    try{
        let cid = req.params.cid
        let pid = req.params.pid
        await cartManager.addProductToTheCart(cid, pid)
        res.send('The product has been added.')
    }
    catch(error){
        res.status(500).json('There is an error in the server.')
    }
})

router.delete('/:cid/products/:pid', async(req, res) => {
    try{
        let cid = req.params.cid
        let pid = req.params.pid
        await cartManager.deleteaProductFromTheCart(cid, pid)
        res.send('The product has been eliminated from the cart.')
    }
    catch(error){
        res.status(500).json('There is an error in the server.')
    }
})

router.put('/:cid', async(req, res) => {
    let cid = req.params.cid
    let prods = req.body
    try{
        await cartManager.updateProductsFromCart(cid,prods)
        res.send('Products have been updated.')
    }
    catch(error){
        res.status(500).json('There is an error in the server.')
    }
})

router.put('/:cid/products/:pid', async(req, res) => {
    let cid = req.params.cid
    let pid = req.params.pid
    const quantityProd = req.body
    try{
        await cartManager.updateQuantity(cid,pid, quantityProd)
        res.send('The quantity of the product has been changed.')
    }
    catch(error){
        res.status(500).json('There is an error in the server.')
    }
})

router.delete('/:cid', async(req, res) => {
    let cid = req.params.cid
    try{
        await cartManager.deleteAllProdsInTheCart(cid)
        res.send('All products have been deleted.')
    }
    catch(error){
        res.status(500).json('There is an error in the server.')
    }
})
export default router