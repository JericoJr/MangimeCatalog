const express = require('express');
const router = express.Router();
const transporter = require("../config/mailer");
// const resend = require("../config/mailer");
const mongoose = require("mongoose");

router.get("/", (request, response) => {
    response.render("forgot", {change: "", message: ""});
});

router.post("/sendCode", async (request, response) => {
    const userEmail = request.body.email;  
    const emailResult = await checkEmail(userEmail);
    if (!emailResult) {
        response.render("forgot", {change: "", message: `<p class="email-err">Email Not Found. Try Signing Up.</p>`});
    } else {
        const code = generateCode();
        const message = `Here's your code: ${code}`;
        try {
            let result = await transporter.sendMail({
                from: process.env.EMAIL_USER,  
                to: userEmail,
                subject: "MangimeCatalog: Change Password Code",
                text: message
            });
            console.log("Email sent result:", result);

            let changeForm = `
                <form action="/forgot/change" method="POST">
                    <fieldset class="change-fieldset">
                            <label>New Password:<input class="change-password" type="text" name="passInput" required></label> <br>
                            <label>Code:<input class="change-code" type="number" name="codeInput" min="1000" max="9999" required></label> <br>                    <div class="change-buttons">
                            <input class="change-reset" type="reset">
                            <input class="change-submit" type="submit" value="Change Password">
                        </div>
                    </fieldset>
                </form>
            `;
            request.session.temp = {
                targetCode: code, 
                email: userEmail
            };
            response.render("forgot", {change: changeForm, message: ""});
        } catch (err) {
            console.error(err);
            response.render("forgot", {change: "", message: ""});
        }
    }
});

router.post("/change", async (request, response) => {
    const inputCode = Number(request.body.codeInput);
    const newPass = request.body.passInput;
    let changeForm = `
        <form action="/forgot/change" method="POST">
            <fieldset class="change-fieldset">
                <label>New Password:<input class="change-password" type="text" name="passInput" required></label> <br>
                <label>Code:<input class="change-code" type="number" name="codeInput" required></label> <br>
                <div class="change-buttons">
                    <input class="change-reset" type="reset">
                    <input class="change-submit" type="submit" value="Change Password">
                </div>
            </fieldset>
        </form>
    `;
    if (inputCode == request.session.temp.targetCode) {
        await changePassword(newPass, request);
        request.session.destroy(err => {
            if (err) {
                console.error(err);
                response.render("forgot", {change: "", message: `<p class="code-err">Error with Changing Password. Try Again</p>`});
            }
            response.render("forgot", {change: "", message: `<p class="code-succ">Password Successfully Changed. Log In.</p>`});
         });
    } else {
        response.render("forgot", {change: changeForm, message: `<p class="code-err">Wrong Code. Try Again.</p>`});
    }

});

async function checkEmail(emailInput) {
    try {
        await mongoose.connect(process.env.MONGO_CONNECTION_STRING, { dbName: "contentDB"});
            const collection = mongoose.connection.db.collection("users");
            const user = await collection.findOne({email: emailInput});
            // console.log(`\nEmail Found: ${user}`);
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

async function changePassword(newPassword, request) {
    try {
        await mongoose.connect(process.env.MONGO_CONNECTION_STRING, { dbName: "contentDB"});
        const collection = mongoose.connection.db.collection("users");
        const result = await collection.updateOne({email: request.session.temp.email}, {$set: {password: newPassword}});
        return result;
    } catch (err) {
        console.error(err);
        return false;
    }
}

function generateCode() {
    return Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000; //generates random number between 1000-9999
}

module.exports = router;