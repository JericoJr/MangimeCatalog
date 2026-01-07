const express = require('express');
const router = express.Router();

router.get("/", (request, response) => {
    response.render("account", {email: request.session.user.email, user: request.session.user.name});
});

router.post("/signout", (request, response) => {
    console.log(`Signing Out Session: ${request.session.user.email}`);
    request.session.destroy(err => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error logging out");
        }
        response.redirect("/");
    });
});


module.exports = router;