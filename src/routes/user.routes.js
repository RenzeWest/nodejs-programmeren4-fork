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

// Validation for create body
const validateUserCreate = (req, res, next) => {
    try {
        const reqB = req.body;
        // Check if the required fields are presant
        chai.expect(reqB, 'Missing firstName field').to.have.property('firstName');
        chai.expect(reqB, 'Missing lastName field').to.have.property('lastName');
        chai.expect(reqB, 'Missing emailAdress field').to.have.property('emailAdress')
        chai.expect(reqB, 'Missing password field').to.have.property('password')
        chai.expect(reqB, 'Missing isActive field').to.have.property('isActive')
        chai.expect(reqB, 'Missing street field').to.have.property('street')
        chai.expect(reqB, 'Missing city field').to.have.property('city')
        chai.expect(reqB, 'Missing phoneNumber field').to.have.property('phoneNumber')
        chai.expect(reqB, 'Missing roles field').to.have.property('roles')

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
        validateEmail(reqB.emailAdress);
        validatePassword(reqB.password);
        validatePhonenumber(reqB.phoneNumber);

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
const validateUserPut = (req, res, next) => {
    try {
        const reqB = req.body;

        // Check if an email is presant
        if (!(reqB.emailAdress)) {
            throw new Error('No email has been entered');
        }

        // Check if the email is a string and if so validate
        chai.expect(reqB.emailAdress, 'No correct emailAdress value given').to.be.a('string').to.not.be.empty;
        validateEmail(reqB.emailAdress);

        // Non of there fields are required thats why it tests first if they exist
        if (reqB.phoneNumber)  {
            chai.expect(reqB.phoneNumber, 'No correct phoneNumber value given').to.be.a('string').to.not.be.empty;
            validatePhonenumber(reqB.phoneNumber);
        }
        if (reqB.password) { 
            chai.expect(reqB.password, 'No correct password value given').to.be.a('string').to.not.be.empty;
            validatePassword(reqB.password);
        }
        
        logger.trace('User put succesfully validated');
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

// Validate Email
function validateEmail(email) {
    const patern = /^[a-zA-Z]\.[a-zA-Z]{2,}\@[a-zA-Z]{2,}\.[a-zA-Z]{2,3}$/;
    if (!patern.test(email)) throw new Error(`${email} email not valid`);

}

// Validate Password
function validatePassword(password) {
    const patern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])\S{8,}$/;

    if(!(patern.test(password))) throw new Error(`password not strong enough`);
}

// Validate PhoneNumber
function validatePhonenumber(phoneNumber) {
    const patern = /^[0][6](\ |\-){1,1}[0-9]{8,8}$/;
    if (!patern.test(phoneNumber)) throw new Error(`${phoneNumber} phoneNumber not valid`);
}
// Userroutes
router.post('/api/user', validateUserCreate, userController.create);
router.get('/api/user', userController.getUsers);
router.get('/api/user/:userId', userController.getById);
router.put('/api/user/:userId', validateUserPut, userController.updateById);
router.delete('/api/user/:userId', userController.deleteById);

module.exports = router
