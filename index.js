const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const session = require("express-session");
const collection = require('./config');
const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
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

app.get("/profile", (req, res) => {
    if (req.session.user) {
        res.render("profile", { user: req.session.user });
    } else {
        res.redirect("/login");
    }
});

app.get("/edit-profile", (req, res) => {
    if (req.session.user) {
        res.render("edit-profile", { user: req.session.user });
    } else {
        res.redirect("/login");
    }
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
            res.send("Signup successful!");
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
                req.session.user = check;
                res.render("home", { user: req.session.user });
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
            return res.redirect("/");
        }
        res.clearCookie("connect.sid");
        res.redirect("/");
    });
});

app.post("/edit-profile", async (req, res) => {
    try {
        const updatedData = {
            address: req.body.address,
            phone: req.body.phone,
            facebook: req.body.facebook,
            instagram: req.body.instagram
        };

        const updatedUser = await collection.findByIdAndUpdate(
            req.session.user._id,
            { $set: updatedData },
            { new: true }
        );

        req.session.user = updatedUser;
        res.redirect("/profile");
    } catch (error) {
        res.send("Error: " + error.message);
    }
});

app.get("/product", (req, res) => {
    if (req.session.user) {
        res.render("product", { user: req.session.user });
    } else {
        res.redirect("/login");
    }
});

// Start server
const port = 5000;
app.listen(port, () => {
    console.log(`Server running on Port: ${port}`);
});
