"use strict";

var path = require('path');
var util = require('util');
var logger = __configurations.getLogger(__filename);
var schema = require(path.resolve(__dirname, 'schema.js'));
var validator = require('is-my-json-valid');

module.exports = (whichSchema, data) => {
    if(!schema[whichSchema]) {
        logger.error('Can not perform schema validate, schema not found', whichSchema);
        throw (__errors.service.SCHEMA_NOT_FOUND);
    }
    logger.debug('Checking the validity of payload', data);
    var validate = validator(schema[whichSchema]);
    if(!validate(data)) {
        logger.error('Schema validation failed', validate.errors);
        throw (__errors.service.INCORRECT_SCHEMA);
    };
}
