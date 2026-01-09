const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: String,
  user: String,
  password: String
});

const User = mongoose.models.User || mongoose.model("User", userSchema);


router.get("/", (request, response) => {
    response.render("signup", {message: ""});
});

router.post("/submit", async (request, response) => {
    const found = await checkEmail(request.body.email);
    if (found) {
        const message = `<p class="signup-error">Email Already Found. Try Logging In.</p>`;
        response.render("signup", {message: message});
    } else {
        await addUser(request);
        response.redirect("/");
    }
});

async function checkEmail(emailInput) {
    try {
        await mongoose.connect(process.env.MONGO_CONNECTION_STRING, { dbName: "contentDB"});
            const collection = mongoose.connection.db.collection("users");
            const user = await collection.findOne({email: emailInput});
            console.log(`\nEmail Found: ${user}`);
            if (user) {
                return true;
            } else {
                return false;
            }
    } catch (err) {
        console.error(err);
        return false;
    }
}

async function addUser(request) {
    try {
        await mongoose.connect(process.env.MONGO_CONNECTION_STRING, { dbName: "contentDB"});
        await User.create({
            email: request.body.email,
            user: request.body.user,
            password: request.body.password
        });
        mongoose.disconnect();
    } catch (err) {
    console.error(err);
    return false;
    }
    return true;
}

module.exports = router;