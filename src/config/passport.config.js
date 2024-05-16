import passport from "passport"
import local from "passport-local"
import usersModel from "../models/users.model.js"
import { createHash, isValidPassword } from "../utils/hashbcrypt.js"
import GitHubStrategy from "passport-github2"
import cartsModel from "../models/carts.model.js"

const LocalStrategy = local.Strategy

const initializePassport = () => {
    passport.use("register", new LocalStrategy({
        passReqToCallback: true,
        usernameField: "email"
    }, async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body
        let rol = 'User'
        const cart = await cartsModel.create({products: []})
        try {
            if(email === "adminCoder@coder.com" && password === "adminCod3r123"){
                rol = 'Admin'
            }
            let user = await usersModel.findOne({email})
            if (user) {
                return done(null, false)
            }
            let newUser = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password),
                rol,
                cart: cart
            }
            let createUser = await usersModel.create(newUser)
            return done(null, createUser)
        } catch (error) {
            return done(error)
        }
    }))

    passport.use("login", new LocalStrategy({
        usernameField: "email"
    }, async (email, password, done) => {
        try {
            let user = await usersModel.findOne({email})
            if (!user) {
                console.log("This user does not exist")
                return done(null, false)
            }
            if (!isValidPassword(password, user)) {
                return done(null, false)
            }
            return done(null, user)
        } catch (error) {
            return done(error)
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        let user = await usersModel.findById({ _id: id })
        done(null, user)
    })

    passport.use("github", new GitHubStrategy({
        clientID: "Iv23li13IqSKqYz8VEm5",
        clientSecret: "99a507cf6d52bd30e49bb904e50b829d8a38ef04",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        console.log("Profile:", profile)
        try {
            const fullName = profile._json.name
            const nameLength = fullName.length
            const middleIndex = nameLength / 2
            const firstName = fullName.slice(0, middleIndex)
            const lastName = fullName.slice(middleIndex)
            const cart = await cartsModel.create({products: []})
            let rol = 'User'
            let user = await usersModel.findOne({email: profile._json.email})
            if (!user) {
                let newUser = {
                    first_name: firstName,
                    last_name: lastName,
                    age: profile._json.public_repos,
                    email: profile._json.email,
                    password: "",
                    rol,
                    cart: cart
                }

                let newUserResponse = await usersModel.create(newUser)
                done(null, newUserResponse)
            } else {
                done(null, user)
            }
        } catch (error) {
            return done(error)
        }
    }))
}

export default initializePassport