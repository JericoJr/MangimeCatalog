const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");

// const transporter = require("../config/mailer");

const userSchema = new mongoose.Schema({
  email: String,
  user: String,
  password: String
});

const User = mongoose.models.User || mongoose.model("User", userSchema);


router.get("/", (request, response) => {
    response.render("signup");
});

router.post("/submit", async (request, response) => {
    await addUser(request);
    response.render("login");
});

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