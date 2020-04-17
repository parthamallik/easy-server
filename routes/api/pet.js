/*
 * Version		: 0.0.1
 * Description	: All routes for "/pet"
 *
 */

"use strict";

var path = require('path'),
    express = require("express"),
    router = express.Router(),
    pet = require(path.resolve(__dirname, '../handlers/pet')),
    auth = require(path.resolve(__dirname, '../handlers/auth'));


router.post("/", auth.authenticate, pet.create);  // create a new pet
router.get("/", auth.authenticate, pet.read);  // get petes
router.get("/:id", auth.authenticate, pet.read);  // get pet info for a given id
router.put("/:id", auth.authenticate, pet.update);  // updates a pet
router.delete("/:id", auth.authenticate, pet.delete);  // Deletes a petes
module.exports = router;
