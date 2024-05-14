const express = require('express')
const chai = require('chai')
chai.should()
const router = express.Router()
const mealController = require('../controllers/meal.controller')
const validateToken = require('../routes/token.routes').validateToken
const logger = require('../util/logger')

// Validation methods
function validateMealPost(req, res, next) {
    try {
        const reqB = req.body;

        // Check if the required fields are presant
        chai.expect(reqB, 'Missing isActive field').to.have.property('isActive');
        chai.expect(reqB, 'Missing isVega field').to.have.property('isVega');
        chai.expect(reqB, 'Missing isVegan field').to.have.property('isVegan');
        chai.expect(reqB, 'Missing isToTakeHome field').to.have.property('isToTakeHome');
        chai.expect(reqB, 'Missing dateTime field').to.have.property('dateTime');
        chai.expect(reqB, 'Missing maxAmountOfParticipants field').to.have.property('maxAmountOfParticipants');
        chai.expect(reqB, 'Missing price field').to.have.property('price');
        chai.expect(reqB, 'Missing imageUrl field').to.have.property('imageUrl');
        chai.expect(reqB, 'Missing name field').to.have.property('name');
        chai.expect(reqB, 'Missing description field').to.have.property('description');
        chai.expect(reqB, 'Missing allergenes field').to.have.property('allergenes');

        // Check if fields are empty
        chai.expect(reqB.isActive, 'isActive validation failed, ').to.be.a('number')
        chai.expect(reqB.isVega, 'isVega validation failed, ').to.be.a('number')
        chai.expect(reqB.isVegan, 'isVegan validation failed, ').to.be.a('number')
        chai.expect(reqB.isToTakeHome, 'isToTakeHome validation failed, ').to.be.a('number')
        chai.expect(reqB.dateTime, 'dateTime validation failed, ').to.be.a('string').to.not.be.empty;
        chai.expect(reqB.maxAmountOfParticipants, 'maxAmountOfParticipants validation failed, ').to.be.a('number')
        chai.expect(reqB.price, 'price validation failed, ').to.be.a('number')
        chai.expect(reqB.imageUrl, 'imageUrl validation failed, ').to.be.a('string').to.not.be.empty;
        chai.expect(reqB.name, 'name validation failed, ').to.be.a('string').to.not.be.empty;
        chai.expect(reqB.description, 'description validation failed, ').to.be.a('string').to.not.be.empty;
        chai.expect(reqB.allergenes, 'allergenes validation failed, ').to.be.a('string').to.not.be.empty;

        logger.trace('Meal successfully validated');
        next();
    } catch (ex) {
        logger.trace('Meal create body failed:', ex.message)
        next({
            status: 400,
            message: ex.message,
            data: {}
        })
    }
}

// Routes

router.post('/api/meal', validateToken, validateMealPost, mealController.createMeal);
router.get('/api/meal', mealController.getAllMeals);
router.get('/api/meal/:mealId', mealController.getMealById);
router.delete('/api/meal/:mealId', validateToken, mealController.deleteMealByID);

module.exports = router;