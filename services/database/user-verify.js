"use strict";

var path = require('path');
var logger = __configurations.getLogger(__filename);
var uuidv4 = require("uuid/v4");
var UserVerify = require(path.resolve(__dirname, 'models')).UserVerify;

module.exports = {
    'create': async (verify) => {
        verify.verifytoken = uuidv4();
        try {
            logger.debug('Creating user-verify record.');
            return await UserVerify.create(verify);
        } catch (err) {
            logger.error('Can not create user_verify record for ', verify);
            logger.error(err);
            throw(err);
        };
    },
    'read': async function(verify) {
        try {
            return await UserVerify.findAll({'where': verify});
        } catch (err) {
            logger.error('Can not read user verify record for', verify);
            logger.error(err);
            throw(err);
        }
    },
    'delete': async function(verify) {
        try {
            logger.debug('Deleting user-verify record.')
            return await UserVerify.destroy({'where': verify});
        } catch (err) {
            logger.error('Can not delete user verify record(s) for', verify);
            logger.error(err);
            throw(err);
        }
    }
};
