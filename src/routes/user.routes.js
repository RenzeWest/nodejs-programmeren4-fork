const express = require('express')
const assert = require('assert')
const chai = require('chai')
chai.should()
const router = express.Router()
const userController = require('../controllers/user.controller')
const logger = require('../util/logger')
const e = require('express')

// Input validation functions for user routes
// const validateUserCreate = (req, res, next) => {
//     if (!req.body.emailAdress || !req.body.firstName || !req.body.lastName) {
//         next({
//             status: 400,
//             message: 'Missing email or password',
//             data: {}
//         })
//     }
//     next()
// }

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

// Validation for create body
const validateUserCreate = (req, res, next) => {
    try {
        const reqB = req.body;
        // Check if the required fields are presant
        chai.expect(reqB).to.have.property('firstName');
        chai.expect(reqB).to.have.property('lastName');
        chai.expect(reqB).to.have.property('emailAdress')
        chai.expect(reqB).to.have.property('password')
        chai.expect(reqB).to.have.property('isActive')
        chai.expect(reqB).to.have.property('street')
        chai.expect(reqB).to.have.property('city')
        chai.expect(reqB).to.have.property('phoneNumber')
        chai.expect(reqB).to.have.property('roles')

        // check if the required fields are the right type and not empty
        chai.expect(reqB.firstName, 'firstname validation failed, ').to.be.a('string').to.not.be.empty;
        chai.expect(reqB.lastName, 'lastName validation failed, ').to.be.a('string').to.not.be.empty;
        chai.expect(reqB.emailAdress, 'emailAdress validation failed, ').to.be.a('string').to.not.be.empty;
        chai.expect(reqB.password, 'password validation failed, ').to.be.a('string').to.not.be.empty;
        chai.expect(reqB.isActive, 'isActive validation failed, ').to.be.a('boolean').to.not.be.undefined;
        chai.expect(reqB.street, 'street validation failed, ').to.be.a('string').to.not.be.empty;
        chai.expect(reqB.city, 'city validation failed, ').to.be.a('string').to.not.be.empty;
        chai.expect(reqB.phoneNumber, 'phoneNumber validation failed, ').to.be.a('string').to.not.be.empty;
        chai.expect(reqB.roles, 'roles validation failed, ').to.be.a('array');
        
        // Run the special validation methods
        // validateEmail(reqB.emailAdress);
        validatePassword(reqB.password);
        // validatePhonenumber(reqB.phoneNumber);

        logger.trace('User successfully validated');
        next();
    } catch (ex) {
        logger.trace('User create body failed:', ex.message)
        next({
            status: 400,
            message: ex.message,
            data: {}
        })
    }
}

// validatePutBody

// Validate Userid params

// Validate Email
function validateEmail(email) {
    // const patern = '';
    // if (!patern.test(email)) throw new Error(`${email} email not valid`);

}

// Validate Password
function validatePassword(password) {
    console.log(password)
    const patern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])\S{8,}$/;

    if(!(patern.test(password))) throw new Error(`password not strong enough`);
}

// Validate PhoneNumber
function validatePhonenumber(phoneNumber) {

}
// Userroutes
router.post('/api/user', validateUserCreate, userController.create);
router.get('/api/user', userController.getUsers);
router.get('/api/user/:userId', userController.getById);
router.put('/api/user/:userId', userController.updateById);
router.delete('/api/user/:userId', userController.deleteById);

module.exports = router
