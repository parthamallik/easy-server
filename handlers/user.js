/*
 * Version		: 0.0.1
 * Description	: Handler for all routers via /user
 *
 */

'use strict';

var logger = __configurations.getLogger(__filename);
var path = require('path');
var Promise = require('bluebird');
var validateSchema = require(path.resolve(__dirname, '../utils/validate-schema.js'));
var UserService = require(path.resolve(__dirname, '../services/database/user.js'));
var UserVerifyService = require(path.resolve(__dirname, '../services/database/user-verify.js'));
var TokenService = require(path.resolve(__dirname, '../services/database/token.js'));
var util = require('util');
/*

All functionalities are pushed inside module.export.
If there aries a need to reuse any function from another, thats a checkpoint,
we must be doing something unusual. Or else, refactor
and move the common functionality to respective service

*/

module.exports = {
    'create': async (request, response, next) => {
        var user = {};
        user.email = request.body.email;
        user.password = request.body.password;
        user.firstname = request.body.firstname;
        user.lastname = request.body.lastname;
        user.isverified = false;

        try {
            validateSchema('newUser', user);
            logger.debug('Checking if user already exists with email', user.email);
            let userData = await UserService.read({'email':user.email});
            if (userData && userData.length > 0) {
                logger.debug('User already existing', userData);
                throw (__errors.local.EMAIL_ALREAY_REGISTERED);
            }
            user.id = (await UserService.create(user)).id;
            logger.debug('User created with id',user.id);
            user.token = (await UserVerifyService.create({'userid': user.id})).verifytoken;
            logger.debug('Done ! Sending response back');
            response.status(200).json({'id': user.id});
            var verifyURL = request.body.link + user.token,
                options = {
                    'to': user.email,
                    'subject': 'Email Account Verification',
                    'verifyingURL': verifyURL,
                    'name': user.firstname + ' ' + user.lastname
                },
                sendemail = util.promisify(response.mailer.send);
            logger.debug('Sending email with verification link', verifyURL);
            await sendemail('email', options)
                .catch(function(err) {
                    logger.warn('Error while sending verification email');
                    logger.warn(err);
                    return;
                    // Dont send response. Its already sent.
                });
            logger.debug('Verification email Successfully sent.');
        } catch(err) {
            __sendError('Error while registering user', err, response);
        }
    },

    'verify': async (request, response, next) => {

        logger.debug('Verifying user email via token.');
        try {
            var verifyRecord = {'verifytoken': request.params.token};
            let records = await UserVerifyService.read(verifyRecord);
            if (!records || records.length == 0) {
                logger.debug('Could not find user associated with token ', verifyRecord.verifytoken);
                throw __errors.local.RECORD_NOT_FOUND;
            }
            if (records && records.length > 1) {
                logger.debug('More than 1 user associated with token ', verifyRecord.verifytoken);
                logger.debug(records);
                throw __errors.local.INTERNAL_SERVER_ERROR;
            }

            verifyRecord.userid = records[0].userid;
            verifyRecord.id = records[0].id;
            logger.debug('Verification token found. Changing status to verified.');
            let user = await UserService.update({ 'id': verifyRecord.userid,'isverified': true});

            verifyRecord.firstname = user.firstname;
            verifyRecord.lastname = user.lastname;

            logger.debug('Deleting verification record');
            await UserVerifyService.delete({'id': verifyRecord.id});

            logger.debug('Done verifying user. Sending response now.');
            response.status(200).json({
                "id": verifyRecord.userid,
                "firstname": verifyRecord.firstname,
                "lastname": verifyRecord.lastname
            });
        } catch(err) {
            __sendError('Error while verifying user', err, response);
        }
    },

    'forgotpassword': async (request, response, next) => {
        var user = {};
        user.email = request.body.email;
        try {
            let userData = await UserService.read(user);
            if (userData && userData.length > 0) {
                user.id = userData[0].id;
                user.firstname = userData[0].firstname;
                user.lastname = userData[0].lastname;
                logger.debug('User found with email:', user.email);
                logger.debug('Creating user verify record');
                user.token = (await UserVerifyService.create({'userid': user.id})).verifytoken;
                logger.debug('Done ! Sending response back');
                response.status(200).json({
                    'id': user.id
                });

                var verifyURL = request.body.link + user.token,
                    options = {
                        "to": user.email,
                        "subject": "Password Reset Request",
                        "verifyingURL": verifyURL,
                        "name": user.firstname + " " + user.lastname
                    },
                    sendemail = util.promisify(response.mailer.send);

                logger.debug('Sending forgot password email with verification link', verifyURL);
                await sendemail("forgotpassword", options)
                    .catch(function(err) {
                        logger.warn('Error while sending forgot password email');
                        logger.warn(err);
                        // Dont send response. Its already sent.
                    });
                logger.debug('Forgot password email Successfully sent.');
            } else {
                logger.debug('User not found with email ', user.email);
                throw __errors.local.RECORD_NOT_FOUND;
            }
        } catch (err) {
            __sendError('Error while forgot password', err, response);
        }
    },

    'resetpassword': async (request, response, next) => {

        var verifyRecord = {'verifytoken': request.body.token};
        var user = {'password': request.body.password };

        try {
            let records = await UserVerifyService.read(verifyRecord);
            if (!records || records.length == 0) {
                logger.debug('Could not find user associated with token ', verifyRecord.verifytoken);
                throw __errors.local.RECORD_NOT_FOUND;
            }
            if (records && records.length > 1) {
                logger.debug('More than 1 user associated with token ', verifyRecord.verifytoken);
                logger.debug(records);
                throw __errors.local.INTERNAL_SERVER_ERROR;
            }

            user.id = records[0].userid;
            user.isverified = true;
            verifyRecord.id = records[0].id;
            let token = {'userid': user.id};

            logger.debug('Verification token found. Updating password and marking the user as verified');
            let tasks =[];
            tasks.push(UserService.updatePassword(user));
            tasks.push(UserVerifyService.delete({'id': verifyRecord.id}));
            tasks.push(TokenService.delete(token));
            let results = await Promise.all(tasks);

            user.firstname = results[0].firstname;
            user.lastname = results[0].lastname;

            logger.debug('Done resetting password! Sending response now.');
            response.status(200).json({
                "id": user.id,
                "firstname": user.firstname,
                "lastname": user.lastname
            });

        } catch(err) {
            __sendError('Error while resetting password', err, response);
        }
    }
}
