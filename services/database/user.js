"use strict";

var path = require('path');
var logger = __configurations.getLogger(__filename);
var bcrypt = require("bcrypt");
var Promise = require('bluebird');
var User = require(path.resolve(__dirname, 'models')).User;

module.exports = {
    'create': async (user) => {
        try {
            logger.debug('Creating user', user);
            user.password = await bcrypt.hash(user.password, 5);
            let newuser = await User.create(user);
            return {'id': newuser.dataValues.id};
        } catch(err) {
            logger.error('Can not create user', user);
            logger.error(err);
            throw (err);
        }
    },
    'read': async (user) => {
        try {
            logger.debug('Reading user from DB for', user);
            let data = await User.findAll({'where': user});
            return data;
        } catch(err) {
            logger.error('Can not read user', user);
            logger.error(err);
            throw (err);
        }
    },
    'checkPassword': async (user) => {
        try {
            let data = await User.findAll({'where': {'email':user.email}});
            if(data.length == 0) {
                logger.error('Could not find user with', user);
                throw(__errors.service.USER_NOT_FOUND);
            }
            user.id = data[0].id;
            if(await bcrypt.compare(user.password, data[0].password)) {
                return user;
            } else {
                logger.error('Incorrect password for', user);
                throw(__errors.service.INCORRECT_PASSWORD) ;
            }
        } catch (err) {
            logger.error('Can not check password for user', user);
            logger.error(err);
            throw (err);
        }
    },
    'update': async (user) => {
        try {
            var userid = user.id;
            delete user.password;
            logger.debug('Updating user in DB', user);
            delete user.id;
            let data = await User.update(user, {
                    'where': {
                        'id': userid
                    },
                    'returning': true
                });
            var updatedUser = data[1][0];
            logger.debug('Updation of user successful.');
            return updatedUser;
        } catch(err) {
            logger.error('Can not update user.', user);
            logger.error(err);
            throw(err);
        };
    },
    'updatePassword': async (user) => {
        try{
            var userid = user.id;
            delete user.id;
            logger.debug('Hasing the password.');
            user.password = (await bcrypt.hash(user.password, 5));
            logger.debug('Updating password for user with userid ', userid);
            let data = await User.update(user, {
                    'where': {
                        'id': userid
                    },
                    'returning': true
                });
            var updatedUser = data[1][0];
            logger.debug('Password update successful.');
            return updatedUser;
        } catch(err) {
            logger.error('Can not update password', user);
            logger.error(err);
            throw(err);
        }
    }
};
