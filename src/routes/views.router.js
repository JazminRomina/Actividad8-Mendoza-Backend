import express from 'express'
import productsModel from '../models/products.model.js'
import { ProductManager } from '../controllers/ProductManager.js'
import { CartManager } from '../controllers/CartManager.js'
const router = express.Router()
const productManager = new ProductManager()
const cartManager = new CartManager()

router.get('/', async(req, res) => {
    const allProds = await productManager.getAllProdsViews(req)
    res.render("home", {
        prods: allProds.response.payload,
        hasPrevPage: allProds.response.hasPrevPage,
        hasNextPage: allProds.response.hasNextPage,
        prevPage: allProds.response.prevPage,
        nextPage: allProds.response.nextPage,
        currentPage: allProds.response.page,
        totalPages: allProds.response.totalPages
    })
})

router.get('/realtimeproducts', async(req, res) => {
    const allProds = await productsModel.find().lean()
    res.render("realTimeProducts", {prods: allProds})
})

router.get('/chat', async (req, res) => {
    res.render("chat")
})

router.get('/products', async (req, res) => {
    const allProds = await productManager.getAllProdsViews(req)
    res.render("products", {
        prods: allProds.response.payload,
        hasPrevPage: allProds.response.hasPrevPage,
        hasNextPage: allProds.response.hasNextPage,
        prevPage: allProds.response.prevPage,
        nextPage: allProds.response.nextPage,
        currentPage: allProds.response.page,
        totalPages: allProds.response.totalPages,
        user: req.session.user,
        session: req.session.login
    })
})

router.get('/carts/:cid', async (req, res) => {
    try{
        const cid = req.params.cid
        const cartProdsInIt = await cartManager.getCartById(cid)
        res.render("carts", {
            productsCart: cartProdsInIt.products,
            cartId: cartProdsInIt._id
        })
    }
    catch(error){
        res.status(500).json('We could not find the cart')
    }
})

router.get('/login', (req, res) => {
    res.render("login")
})

router.get('/register', (req, res) => {
    res.render("register")
})

router.get('/profile', async(req, res) => {
    if(!req.session.login){
        return res.redirect("/login")
    }
    res.render("profile", {user: req.session.user})
})
export default router