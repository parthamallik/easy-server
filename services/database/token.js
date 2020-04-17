"use strict";

var path = require('path');
var logger = __configurations.getLogger(__filename);
var uuidv4 = require("uuid/v4");
var Token = require(path.resolve(__dirname, 'models')).Token;

Token.removeAttribute('id');
module.exports = {
    'create': async (token) => {
        try {
            var record = {
                'userid': token.userid,
                'secret': uuidv4()
            };
            return await Token.create(record);
        } catch(err) {
            logger.debug('Can not create secret for ', token);
            logger.error(err);
            throw(err);
        }
    },
    'read': async function(token) {
        try {
            return await Token.findAll({'where': token});
        } catch(err) {
            logger.debug('Can not read tokens for', token);
            logger.error(err);
            throw(err);
        };
    },
    'delete': async function(token) {
        try {
            logger.debug('Deleting secrets for', token);
            return await Token.destroy({ 'where': token });
        } catch (err) {
            logger.debug('Can not delete token(s) record for', token);
            logger.error(err);
            throw(err);
        };
    }
};
