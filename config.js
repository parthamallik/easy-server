/*
 * Version		: 0.0.1
 * Description	: Load all configurations from environment variables
 *
 */

'use strict';
module.exports = {
    'env': process.env.ENV_TYPE || 'development',
    'port': 9001,
    'database': {
        'user': process.env.DB_USER || 'admin',
        'dbname': process.env.DB_SCHEMA || 'ikigai',
        'password': process.env.DB_PASSWORD || 'adminpass',
        'options': {
            'host': process.env.DB_HOST || 'localhost',
            'port': process.env.DB_PORT || '5432',
            'dialect': 'postgres',
            'define': {
                'timestamps': false
            },

            'pool': {
                'max': process.env.DB_POOL_MAX || 20,
                'min': process.env.DB_POOL_MIN || 1
            },
            'logging': false
        }
    },
    'email': {
        'from': 'easy-server@outlook.com',
        'host': 'smtp.office365.com',
        'secure': true,
        'port': 587,
        'auth': {
            'user': process.env.EMAIL_USER || 'easy-server@outlook.com',
            'pass': process.env.EMAIL_PASSWORD || 'X>!L?S-h>R]+g9(8'
        },
        'tls': {
            'ciphers': 'SSLv3'
        }
    },
    'jwt': {
        'secret': process.env.JWT_SECRET || 'Ea$yS@cr@t$!c@ntm@k3',
        'expiry': process.env.JWT_EXPIRY || '24h'
    },

    'github': {
        'development': {
            'clientID': 'dd1e373ac60d9ae2ad24',
            'clientSecret': '57b81431ebefda64b3ba11d54e3ee8ee0b081550',
            'callback': 'http://localhost:9001/api/login/github/callback',
            'scope': ['user:email']
        },
        'production': {
            'clientID': 'dd1e373ac60d9ae2ad24',
            'clientSecret': '57b81431ebefda64b3ba11d54e3ee8ee0b081550',
            'callback': 'http://yourserver.com/api/login/github/callback',
            'scope': ['user:email']
        }
    },

    'getLogger': function(module) {
        var moduleName = module.replace(__dirname + '/', '');
        var pino = require('pino');
        return pino({
            'prettyPrint': { colorize: true },
            'name': moduleName,
            'base': null,
            'level': process.env.LOG_LEVEL || 'debug'
        });
    }
};
