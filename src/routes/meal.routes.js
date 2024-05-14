const express = require('express')
const chai = require('chai')
chai.should()
const router = express.Router()
const mealController = require('../controllers/meal.controller')
const logger = require('../util/logger')

// Validation methods
function validateMealPost(req, res, next) {
    try {
        const reqB = req.body;
        

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

router.post('/api/meal', validateMealPost, mealController.createMeal);
router.get('/api/meal', mealController.getAllMeals);
router.get('/api/meal/:mealId', mealController.getMealById);
router.delete('/api/meal/:mealId', mealController.deleteMeal);