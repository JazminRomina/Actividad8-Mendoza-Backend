import mongoose from "mongoose"

const messageSchema = new mongoose.Schema({
    user: {type: String, require: true},
    message: {type: String, require: true}
},
{
    versionKey: false
})

const MessageModel = mongoose.model("messages", messageSchema)

export default MessageModel