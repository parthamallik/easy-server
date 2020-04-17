/*
 * Version		: 0.0.1
 * Description	: Handler for all Pet CRUD
 *
 */

'use strict';

var logger = __configurations.getLogger(__filename);
var path = require('path');
var validateSchema = require(path.resolve(__dirname, '../utils/validate-schema.js'));
var PetService = require(path.resolve(__dirname, '../services/database/pet.js'));
module.exports = {
    'create': async (req, res, next) => {
        let userId = req.user.id
        var pet = {
            createdBy : userId,
            modifiedBy : userId,
            createdAt : new Date(),
            modifiedAt : new Date()
        };
        for(var key in req.body){
            pet[key] = req.body[key]
        }
        try {
            validateSchema('newPet', pet);
            let petId = (await PetService.create(pet)).id;
            logger.debug('Pet created ! Sending response back');
            res.status(200).json({'id': petId});
        }catch(err) {
            __sendError('Error while creating a Pet', err, res);
        };
    },

    'read': async (req, res, next) => {
        let filter = {};
        if(req.params.hasOwnProperty('id'))
            filter.id = req.params.id;
        try {
            let pet = (await PetService.read(filter));
            logger.debug('Done reading pet(s) ! Sending response back');
            res .status(200).json(pet);
        } catch(err) {
            __sendError('Error while obtaining Pet(s)', err, res);
        };
    },

    'update': async (req, res, next) => {
        let userId = req.user.id
        var pet = {
            id : req.params.id,
            modifiedBy : userId,
            modifiedAt : new Date()
        };
        for(var key in req.body){
            pet[key] = req.body[key]
        }
        try {
            validateSchema('updatePet', pet);
            let updatedPet = (await PetService.update(pet));
            logger.debug('Pet updatedPet ! Sending response back');
            res.status(200).json(updatedPet);
        }catch(err) {
            __sendError('Error while updating a Pet', err, res);
        };
    },

    'delete': async (req, res, next) => {
        let filter = {};
        if(req.params.hasOwnProperty('id'))
            filter.id = req.params.id;
        try {
            let deletedCount = (await PetService.delete(filter));
            logger.debug('Pet deleted ! Sending response back');
            res .status(200).json({'records': deletedCount});
        } catch(err) {
            __sendError('Error while deleting Pet', err, res);
        };
    },
}
