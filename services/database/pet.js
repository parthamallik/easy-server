"use strict";

var path = require('path');
var logger = __configurations.getLogger(__filename);
var Pet = require(path.resolve(__dirname, 'models')).Pet;

module.exports = {
    'create': async (pet) => {
        try {
            logger.debug('Creating pet', pet);
            let newpet = await Pet.create(pet);
            logger.debug('Pet created with id', newpet.dataValues.id)
            return {'id': newpet.dataValues.id};
        } catch(err) {
            logger.error('Can not create pet', pet);
            logger.error(err);
            throw (err);
        }
    },
    'read': async (pet) => {
        try {
            logger.debug('Reading pet from DB for', pet);
            let data = await Pet.findAll({'where': pet});
            return data;
        } catch(err) {
            logger.error('Can not read pet', pet);
            logger.error(err);
            throw (err);
        }
    },
    'update': async (pet) => {
        try {
            var petid = pet.id;
            logger.debug('Updating pet in DB', pet);
            delete pet.id;
            let data = await Pet.update(pet, {
                    'where': {
                        'id': petid
                    },
                    'returning': true
                });
            var updatedPet = data[1][0];
            logger.debug('Updation of pet successful.');
            return updatedPet;
        } catch(err) {
            logger.error('Can not update pet.', pet);
            logger.error(err);
            throw(err);
        };
    },
    'delete': async function(pet) {
        try {
            logger.debug('Deleting pet for', pet);
            return await Pet.destroy({ 'where': pet });
        } catch (err) {
            logger.debug('Can not delete pet record for', pet);
            logger.error(err);
            throw(err);
        };
    }
};
