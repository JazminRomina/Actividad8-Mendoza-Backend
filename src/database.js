import mongoose from "mongoose"

mongoose.connect('mongodb+srv://Coder53130:coderhouse@cluster0.00wvypr.mongodb.net/Ecommerce?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('MONGODB is working'))
    .catch((error) => console.log('There is an error with MONGODB', error))