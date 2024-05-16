import express from 'express'
import passport from 'passport'

const router = express.Router()

router.post("/", passport.authenticate("register", {
    failureRedirect: "/failedregister"
}) ,async(req, res) => {
    if(!req.user){
        return res.status(400).send("Invalid credentials")
    }
    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email,
        rol: req.user.rol,
        cart: req.user.cart
    }
    req.session.login = true

    res.redirect("/profile")
})

router.get("/failedregister", (req, res) => {
    res.send("There is a problem with the page!")
})

export default router