const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");

router.get("/", (request, response) => {
    response.render("login", {message: `<p></p>`});
});

router.post("/login/submit", async (request, response) => {
    let emailInput = request.body.email;
    let passInput = request.body.password;
    const emailResult = await checkEmail(emailInput);
    if (emailResult) {
        const passResult = await checkPass(emailInput, passInput);
        if (passResult) {
            const userResult = await getUser(emailInput, passInput);
            request.session.user = {
                name: userResult, 
                email: emailInput
            }
            console.log(`Current Session: ${request.session.user.name}`)
            response.redirect("/home");
        } else {
            response.render("login", {message: `<p class="login-error">Incorrect Password</p>`});
        }
    } else {
        response.render("login", {message: `<p class="login-error">User Not Found.</p>`});
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

async function checkPass(emailInput, passInput) {
    try {
        await mongoose.connect(process.env.MONGO_CONNECTION_STRING, { dbName: "contentDB"});
            const collection = mongoose.connection.db.collection("users");
            const user = await collection.findOne({email: emailInput, password: passInput});
            console.log(`\nPass Found: ${user}`);
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

async function getUser(emailInput, passInput) {
    try {
        await mongoose.connect(process.env.MONGO_CONNECTION_STRING, { dbName: "contentDB"});
            const collection = mongoose.connection.db.collection("users");
            const result = await collection.findOne({email: emailInput, password: passInput});
            console.log(`\nUser:  ${result}`);
            if (result) {
                return result.user;
            } else {
                return null;
            }
    } catch (err) {
        console.error(err);
        return false;
    }
}

module.exports = router;