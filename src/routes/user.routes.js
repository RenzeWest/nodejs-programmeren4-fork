const express = require('express')
const assert = require('assert')
const chai = require('chai')
chai.should()
const router = express.Router()
const userController = require('../controllers/user.controller')
const logger = require('../util/logger')

// Tijdelijke functie om niet bestaande routes op te vangen
const notFound = (req, res, next) => {
    next({
        status: 404,
        message: 'Route not found',
        data: {}
    })
}

// Input validation functions for user routes
const validateUserCreate = (req, res, next) => {
    if (!req.body.emailAdress || !req.body.firstName || !req.body.lastName) {
        next({
            status: 400,
            message: 'Missing email or password',
            data: {}
        })
    }
    next()
}

// Input validation function 2 met gebruik van assert
const validateUserCreateAssert = (req, res, next) => {
    try {
        assert(req.body.emailAdress, 'Missing email')
        assert(req.body.firstName, 'Missing or incorrect first name')
        assert(req.body.lastName, 'Missing last name')
        next()
    } catch (ex) {
        next({
            status: 400,
            message: ex.message,
            data: {}
        })
    }
}

// Input validation function 2 met gebruik van assert
const validateUserCreateChaiShould = (req, res, next) => {
    try {
        req.body.firstName.should.not.be.empty.and.a('string')
        req.body.lastName.should.not.be.empty.and.a('string')
        req.body.emailAdress.should.not.be.empty.and.a('string').and.match(/@/)
        next()
    } catch (ex) {
        next({
            status: 400,
            message: ex.message,
            data: {}
        })
    }
}

const validateUserCreateChaiExpect = (req, res, next) => {
    try {
        const reqB = req.body;
        // Check if all fields are entered and the right type
        // assert(reqB, "Missing a field in the body or a field is not correct");

        // chai.expect(reqB.firstName, 'Firstname moet een string zijn en mag niet leeg zijn, error').to.be.a('string').and.not.empty;
        
        // chai.expect(reqB).to.have.property('lastName').that.is.not.empty.and.is.a('string');
        // chai.expect(reqB).to.have.property('emailAdress').that.is.not.empty.and.is.a('string');
        // chai.expect(reqB).to.have.property('password').that.is.not.empty.and.is.a('string');
        // chai.expect(reqB).to.have.property('isActive').that.is.not.empty.and.is.a('boolean');
        // chai.expect(reqB).to.have.property('street').that.is.not.empty.and.is.a('string');
        // chai.expect(reqB).to.have.property('city').that.is.not.empty.and.is.a('string');
        // chai.expect(reqB).to.have.property('phoneNumber').that.is.not.empty.and.is.a('string');
        // chai.expect(reqB).to.have.property('role').that.is.not.empty.and.is.a('array');

        // // // Check if there is a value in the fields
        // assert(reqB, "One of the fields is empty");
        // chai.expect(reqB.firstName).not.to.be.empty;
        // chai.expect(reqB.lastName).not.to.be.empty;
        // chai.expect(reqB.emailAdress).not.to.be.empty;
        // chai.expect(reqB.password).not.to.be.empty;
        // chai.expect(reqB.isActive).not.to.be.undefined;
        // chai.expect(reqB.street).not.to.be.empty;
        // chai.expect(reqB.city).not.to.be.empty;
        // chai.expect(reqB.phoneNumber).not.to.be.empty;

        // Check if a valid firstname has been entered
        assert(reqB.firstName, 'Missing or incorrect firstName field')
        chai.expect(reqB.firstName).to.not.be.empty
        chai.expect(reqB.firstName).to.be.a('string')
        chai.expect(reqB.firstName).to.match(
            /^[a-zA-Z]+$/,
            'firstName must be a string'
        )

        // Check if the email is valid


        logger.trace('User successfully validated')
        next()
    } catch (ex) {
        logger.trace('User validation failed:', ex.message)
        next({
            status: 400,
            message: ex.message,
            data: {}
        })
    }
}

// Userroutes
router.post('/api/user', validateUserCreateChaiExpect, userController.create);
router.get('/api/user', userController.getAll);
router.get('/api/user/:userId', userController.getById);
router.put('/api/user/:userId', userController.updateById);
router.delete('/api/user/:userId', userController.deleteById);

module.exports = router
