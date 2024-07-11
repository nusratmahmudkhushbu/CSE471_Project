const mongoose = require("mongoose");
const connect = mongoose.connect("mongodb://localhost:27017/login");

connect.then(() => {
    console.log("Database connected successfully");
}).catch(() => {
    console.log("Database connection failed");
});

const LoginSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String
    },
    phone: {
        type: String
    },
    facebook: {
        type: String
    },
    instagram: {
        type: String
    },
    cart: [{
        item: {
            type: String
        },
        quantity: {
            type: Number
        }
    }]
});

const collection = mongoose.model("login", LoginSchema);
module.exports = collection;
