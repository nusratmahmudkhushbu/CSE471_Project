const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express(); 

app.use(cors());

mongoose.connect("mongodb://localhost:27017/ecommerce", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB");
}).catch(err => {
    console.error("Error connecting to MongoDB:", err.message);
});

const NotificationSchema = new mongoose.Schema({
    quantity: Number,
    product: String,
    price: Number
});

const NotificationModel = mongoose.model("Notification", NotificationSchema);

app.get("/notifications", async (req, res) => {
    try {
        const notifications = await NotificationModel.find();
        console.log("Fetched notifications: ", notifications);
        res.json(notifications);
    } catch (error) {
        console.error("Error fetching notifications: ", error.message);
        res.status(500).json({ message: error.message });
    }
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'notification.html'));
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
