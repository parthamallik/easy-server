/*
 * Version		: 0.0.1
 * Description	: All routes for "/user"
 *
 */

"use strict";

var path = require('path'),
    express = require("express"),
    router = express.Router(),
    handler = require(path.resolve(__dirname, '../handlers/user.js'));

// Unprotected routes.

router.post("/", handler.create);  // create new user
router.get("/verify/:token", handler.verify); // activate via email
router.post("/forgotpassword", handler.forgotpassword); // get password recovery email
router.post("/resetpassword", handler.resetpassword); // reset password via token

module.exports = router;
