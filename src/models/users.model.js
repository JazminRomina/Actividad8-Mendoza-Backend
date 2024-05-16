import mongoose from "mongoose"

const usersSchema = new mongoose.Schema({
    first_name: {type: String, required: true},
    last_name: {type: String},
    email: {type: String, required: true, index: true, unique: true},
    password: {type: String},
    age: {type: Number},
    rol: {type: String},
    cart: {
        type: mongoose.Schema.Types.ObjectId
    }
},
{
    versionKey: false
})

const usersModel = mongoose.model("users", usersSchema)

export default usersModel