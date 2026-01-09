const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");


router.get("/", (request, response) => {
    response.render("account", {email: request.session.user.email, user: request.session.user.name, userForm: null, passwordForm: null, message: null});
});

router.post("/signout", (request, response) => {
    // console.log(`Signing Out Session: ${request.session.user.email}`);
    request.session.destroy(err => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error logging out");
        }
        response.redirect("/");
    });
});

router.post("/changeUser", (request, response) => {
    const userForm = `
        <fieldset class="info-fieldset">
        <form action="/account/submitUser" method="POST">
            <label>New Username: <input class="signup-user" type="text" name="user" required></label> 
            <button type="submit" class="change-btn">Submit</button>
        </form>
        </fieldset>
    `;
    response.render("account", {email: request.session.user.email, user: request.session.user.name, userForm: userForm, passwordForm: null, message: null});
});

router.post("/changePassword", (request, response) => {
    const passwordForm = `
        <fieldset class="info-fieldset">
        <form action="/account/submitPassword" method="POST">
            <label>New Password: <input class="signup-pass" type="text" name="password" required></label> 
            <button type="submit" class="change-btn">Submit</button>
        </form>
        </fieldset>
    `;
    response.render("account", {email: request.session.user.email, user: request.session.user.name, userForm: null, passwordForm: passwordForm, message: null});
});

router.post("/submitPassword", async (request, response) => {
    const newPassword = request.body.password;
    const userEmail = request.session.user.email;
    let mess;
    try {
        await mongoose.connect(process.env.MONGO_CONNECTION_STRING, { dbName: "contentDB"});
        const collection = mongoose.connection.db.collection("users");
        await collection.updateOne({email: userEmail}, {$set: {password: newPassword}});
        mess = `<p class="succ-message">Password Successfully Changed!</p>`;
    } catch (err) {
        mess = `<p class="err-message">Error Changing Password</p>`;
        console.error(err);
    } 
    response.render("account", {email: userEmail, user: request.session.user.name, userForm: null, passwordForm: null, message: mess});
});

router.post("/submitUser", async (request, response) => {
    const newUser = request.body.user;
    const userEmail = request.session.user.email;
    let mess;
    try {
        await mongoose.connect(process.env.MONGO_CONNECTION_STRING, { dbName: "contentDB"});
        const collection = mongoose.connection.db.collection("users");
        await collection.updateOne({email: userEmail}, {$set: {user: newUser}});
        mess = `<p class="succ-message">Username Successfully Changed!</p>`;
        request.session.user.name = newUser;
    } catch (err) {
        mess = `<p class="err-message">Error Changing Username</p>`;
        console.error(err);
    } 
    response.render("account", {email: userEmail, user: newUser, userForm: null, passwordForm: null, message: mess});
});

module.exports = router;