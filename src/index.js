const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const session = require("express-session");
const collection = require('./config');
const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Add this after app.use(express.urlencoded({ extended: false }));

// Example:
app.use(express.static(path.join(__dirname, 'public')));

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // For production, set secure: true if using HTTPS
}));

// Routes
app.get("/", (req, res) => {
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/signup", async (req, res) => {
    try {
        const data = {
            name: req.body.username,
            email: req.body.email,
            password: req.body.password
        };
        const existingUser = await collection.findOne({ name: data.name });
        if (existingUser) {
            res.send("User already exists. Please choose a different username.");
        } else {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(data.password, saltRounds);
            data.password = hashedPassword;

            const userdata = await collection.insertMany(data);
            console.log(userdata);
            res.send("Signup successful!"); // Example: Render success message or redirect to a success page
        }
    } catch (error) {
        res.send("Error: " + error.message);
    }
});

app.post("/login", async (req, res) => {
    try {
        const check = await collection.findOne({ name: req.body.username });
        if (!check) {
            res.send("Username not found");
        } else {
            const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
            if (isPasswordMatch) {
                req.session.user = check; // Store user in session
                res.render("home");
            } else {
                res.send("Wrong password");
            }
        }
    } catch (error) {
        res.send("Error: " + error.message);
    }
});

app.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error destroying session:", err);
            return res.redirect("/"); // Redirect to login page on error
        }
        res.clearCookie("connect.sid"); // Clear session cookie
        res.redirect("/"); // Redirect to login page
    });
});

// Start server
const port = 5000;
app.listen(port, () => {
    console.log(`Server running on Port: ${port}`);
});
