/*
 * Version		: 0.0.1
 * Description	: All routes for "/login"
 *
 */

"use strict";

var path = require('path'),
    express = require("express"),
    router = express.Router(),
    handler = require(path.resolve(__dirname, '../handlers/auth.js'));

router.use(handler.initialize());
router.post("/", handler.login);

router.get("/github", handler.authenticateViaGithub);
router.get("/github/callback", handler.authenticateViaGithub, handler.loginWithoutPassword);

module.exports = router;
