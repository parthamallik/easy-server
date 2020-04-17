/*
 * Version		: 0.0.1
 * Description	: Authentication service using passport js
 *
 */

'use strict';

var logger = __configurations.getLogger(__filename);
var path = require('path');
var _ = require('lodash');
var passport = require('passport');
var jwtPassport = require('passport-jwt');
var jwt = require('jsonwebtoken');
var githubPassport = require('passport-github2');
var validateSchema = require(path.resolve(__dirname, '../utils/validate-schema.js'));
var UserService = require(path.resolve(__dirname, '../services/database/user.js'));
var TokenService = require(path.resolve(__dirname, '../services/database/token.js'));

var localOpts = {};

localOpts.jwtFromRequest = jwtPassport.ExtractJwt.fromAuthHeaderAsBearerToken();
localOpts.secretOrKey = __configurations.jwt.secret;

// Add local Strategy
passport.use(new jwtPassport.Strategy(localOpts, async function(payload, callback) {
    logger.debug('Passport JWT Strategy: after decrypt', payload);
    let activeSecrets = await TokenService.read({'userid': payload.id});
    if (_.map(activeSecrets, 'secret').indexOf(payload.secret) >= 0) {
        return callback(null,payload);
    } else {
        return false;
    }
}));

// Add github Strategy
passport.use(new githubPassport.Strategy(__configurations.github[__configurations.env], function(accessToken, refreshToken, profile, callback) {
    logger.trace('Passport Github Strategy: obtained profile', profile);
    return callback(null, {
        'firstname': profile.displayName,
        'email': profile.emails[0].value,
        'accessToken': accessToken,
        'username': profile.username
    });
}));

var authService = {
    'initialize': function() {
        return passport.initialize();
    },
    'authenticate': function(request, response, next) {
        passport.authenticate('jwt', {
            'session': false
        }, function(err, user, info) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return response.status(401).json(__errors.local.UNAUTHORIZED);
            }
            request.user = user;
            next();
        })(request, response, next);
    },
    'login': async function(request, response, next) {
        var user = {};
        user.email = request.body.email;
        user.password = request.body.password;
        try {
            validateSchema('loginUser', user);
            logger.debug('Checking if pasword supplied is correct for', user);
            let userData = await UserService.checkPassword(user);
            user.id = userData.id;
            logger.debug('Creating secret for jwt ...');
            let tokenrecord = await TokenService.create({'userid': user.id});
            logger.debug('Signing jwt ...');
            user.secret = tokenrecord.secret;
            var token = jwt.sign({
                'id': user.id,
                'secret': user.secret
            }, __configurations.jwt.secret, {
                'expiresIn': __configurations.jwt.expiry
            });
            delete user.id;
            delete user.password;
            delete user.secret;
            delete user.createdat;
            delete user.modifiedat;
            logger.debug('Done! Sending response', user);
            response.status(200).json({
                'token': token,
                'user': user
            });
        } catch (err) {
            logger.error('Error while login');
            logger.error(err);
            return response.status(401).json(__errors.local.UNAUTHORIZED);
        }
    },

    'loginWithoutPassword': async function(request, response, next) {
        var user = {};
        user.email = request.user.email;
        user.password = '';
        user.firstname = request.user.firstname;
        user.lastname = request.user.lastname || '';
        user.isverified = false;

        try {
            logger.debug('Reading user details for password less login ...', user);
            let userData = await UserService.read({'email':user.email});
            if (userData.length == 0) {
                user = await UserService.create(user);
            } else {
                user = userData[0];
            }
            logger.debug('Creating secret for jwt ...');
            let tokenrecord = await TokenService.create({'userid': user.id});
            logger.debug('Signing jwt for passwordless login ...');
            user.secret = tokenrecord.secret;
            var token = jwt.sign({
                'id': user.id,
                'secret': user.secret,
                'githubToken': request.user.accessToken,
                'githubUser': request.user.username
            }, __configurations.jwt.secret, {
                'expiresIn': __configurations.jwt.expiry
            });

            response.redirect('/auth?token=' + token);
        } catch (err) {
            logger.error('Error while login');
            logger.error(err);
            return response.status(401).json(__errors.local.UNAUTHORIZED);
        };
    },

    'authenticateViaGithub': (request, response, next) => {
        passport.authenticate('github', {
            'scope': ['user:email', 'repo'],
            'session': false
        }, function(err, user, info) {
            logger.debug('User details obtained from github', user);
            if (err) {
                return next(err);
            }
            if (!user || !user.email) {
                return response.status(401).json({
                    'error': 'Either email not available or not authorized'
                });
            }
            request.user = user;
            logger.debug('Github user authenticated, passing to next handler.');
            next();
        })(request, response, next);
    }
};

module.exports = authService;
