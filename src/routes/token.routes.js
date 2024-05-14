const express = require('express');
const assert = require('assert');
const router = express.Router();
const logger = require('../util/logger');
// Controllers 
const tokenController = require('../controllers/token.controller');
// For validation
const jwt = require('jsonwebtoken');
const jwtSecretKey = require('../util/config').secretkey;



// Funtion to validate the token
function validateToken(req, res, next) {
    logger.info('Validating Token');
    logger.trace(`Header ${req.headers}`);

    const authHeader = req.headers.authorization;

    // No token was given
    if(!authHeader) {

        logger.warn('Authorization header missing');
        next({
            status: 401,
            message: 'Authorization header missing',
            data: {}
        });

    } else {

        // Haalt de token uit de header (die start op positie 8)
        const token = authHeader.substring(7, authHeader.length);

        jwt.verify(token, jwtSecretKey, (err, payload) => {
            if (err) {
                logger.warn('Not authorized');
                next({
                    status: 401,
                    message: 'Not authorized',
                    data: {}
                });
            }
            if (payload) {
                logger.info('Token is valid', payload);
                req.userId = payload.userId; // Get the userID from the payload of the token
                next();
            }
        });

    }
}

function validateLogin(req, res, next) {
    // Verify that we receive the expected input
    try {
        assert(typeof req.body.emailAdress === 'string', 'email must be a string.')
        assert(typeof req.body.password === 'string', 'password must be a string.')
        next()
    } catch (ex) {
        next({
            status: 409,
            message: ex.toString(),
            data: {}
        })
    }
}


router.post('/api/login', validateLogin, tokenController.login) // Log de gebruiker in in de login controller
// router.get('/api/user/validation')

module.exports = { router, validateToken }