import express from 'express'
import passport from 'passport'

const router = express.Router()

router.post("/login", passport.authenticate("login", {
    failureRedirect: "/api/sessions/faillogin"
}), async (req, res) => {
    if (!req.user) {
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

    res.redirect("/products")
})

router.get("/faillogin", async (req, res) => {
    res.send("There is a problem with the page!")
})

router.get("/github", passport.authenticate("github", {scope: ["user:email"]}), async (req, res) => { })

router.get("/githubcallback", passport.authenticate("github", {
    failureRedirect: "/login"
}), async (req, res) => {
    req.session.user = req.user
    req.session.login = true
    res.redirect("/profile")
})

router.get("/logout", async(req, res) => {
    if(req.session.login){
        req.session.destroy()
    }
    res.redirect("/login")
})
export default router