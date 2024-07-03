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
    email: { // Added email
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

const collection = mongoose.model("login", LoginSchema);
module.exports = collection;
