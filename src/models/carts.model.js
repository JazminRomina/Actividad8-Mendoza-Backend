import mongoose from "mongoose"

const cartsSchema = new mongoose.Schema({
    products: {
        type: [{
            _id: false,
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "products"
            },
            quantity: {
                type: Number
            }
        }],
        default: []
    }
}, {
    versionKey: false
})

cartsSchema.pre("findOne", function(next) {
    this.populate("products.product")
    next()
})

const cartsModel = mongoose.model("carts", cartsSchema)

export default cartsModel