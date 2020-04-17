/*
 * Name			: index.js
 * Author		: Partha Mallik (parthapratim.mallik@ca.com)
 * Version		: 0.0.1
 * Description	: The http server to handle incoming requests
 *
 */

"use strict";

const path = require('path');
global.__configurations = require(path.resolve(__dirname, 'config.js'));
global.__errors = require(path.resolve(__dirname, 'utils/errors.js'));

/*
 * Load the configurations and other
 * modules needed for setting up the express server
 */

var logger = __configurations.getLogger(__filename),
    promises = require('bluebird'),
    express = require('express'),
    cors = require('cors'),
    bodyParser = require('body-parser'),
    debounce = require('connect-debounce'),
    timeout = require('connect-timeout'),
    server = express(),
    mailer = require('express-mailer'),
    fs = require('fs');

var apiRoutes = __dirname + "/routes/api";
var uiRoutes = __dirname + "/routes/ui";

mailer.extend(server, __configurations.email);
server.set('views', __dirname + "/views");
server.set('view engine', 'ejs');

server
    .use(debounce()) // To prevent DOS and DDOS attacks
    .use(cors()) // Enable CORS
    .use(timeout(10000)) // Do't want server to take more than 10 seconds to respond
    .use(bodyParser.json()) // Accepts json body max to 100 kb default
    .use(bodyParser.text()) // Accepts text body max to 100 kb default
    .use(bodyParser.urlencoded({
        'extended': true
    })); // Parse urlencoded body with qs library

server.use(function(req, res, next) {
    if (req.originalUrl == "/echo") {
        res.status(200).send();
    } else if (req.originalUrl.includes("/api")) {
        logger.debug('\n**************** Incoming API request ****************',
            '\nRequest method: ' + req.method,
            '\nRequest path: ' + req.originalUrl,
            '\nRequest params:', req.params,
            '\nRequest query:', req.query,
            '\nRequest body: ', req.body,
            '\n*******************************************************');
        next();
    } else {
        next();
    }
})

/*
 * Load all api routes
 * Keeping it sync to ensure all routes are loaded before the server starts listening.
 */

fs.readdirSync(apiRoutes).forEach(file => {
    var routeName = "/api/" + file.substr(0, file.length - 3),
        router = routes + "/" + file;
    logger.debug('Loading router router/' + file, 'for route', routeName);
    server.use(routeName, require(router));
});

fs.readdirSync(uiRoutes).forEach(file => {
    var routeName = "/" + file.substr(0, file.length - 3),
        router = routes + "/" + file;
    logger.debug('Loading router router/' + file, 'for route', routeName);
    server.use(routeName, require(router));
});


// Web server ( SPA ) routes

logger.debug('Loading default router for SPA');
server.use((req, res, next) => {
    __sendError('No routes found', __errors.service.NOT_FOUND, res);
});
// Default error handling
global.__sendError = (msg, err, response) => {
    logger.error(msg);
    logger.error(err);
    var error = __errors.local.INTERNAL_SERVER_ERROR;
    if (Number(err.code)) {
        error.code = err.code;
        if (err.message) error.message = err.message;
    }
    response.status(error.code).json({
        'message': error.message
    });
}

server.listen(__configurations.port, function() {
    logger.info('Http server started in', __configurations['env'], 'mode.');
    logger.info('Listening on ', __configurations.port);
});
