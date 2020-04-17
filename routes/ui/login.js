/*
 * Version		: 0.0.1
 * Description	: All routes for "/login"
 *
 */

"use strict";

var path = require('path'),
    express = require("express"),
    router = express.Router();

router.use(handler.initialize());
router.get("/", (req, res, next) => {
    res.render('login', {page:'Home', menuId:'home'});
});

module.exports = router;
