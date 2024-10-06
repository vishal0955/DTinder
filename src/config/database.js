
const mongoose = require('mongoose')

const connectDb = async () => {
    await mongoose.connect("mongodb+srv://vishalsingh:Vishal123@cluster0.9gmki.mongodb.net/DevTinder")
}

module.exports = connectDb;