const mealService = require('../services/meal.service');
const logger = require('../util/logger');

let mealController = {

    createMeal: (req, res, next) => {
        const meal = req.body;
        const userId = req.userId;
        logger.info('mealController: createMeal', meal.name);
        
        mealService.createMeal(meal, userId,(error, success) => {
            if (error) {
                return next({
                    status: error.status,
                    message: error.message,
                    data: {}
                });
            }

            if (success) {
                res.status(201).json({
                    status: success.status,
                    message: success.message,
                    data: success.data
                });
            }
        });
        
    },

    getAllMeals: (req, res, next) => {
        logger.info('mealController: getAllMeals');

        mealService.getAllMeals((error, success) => {
            if (error) {
                return next({
                    status: error.status,
                    message: error.message,
                    data: {}
                });
            }

            if (success) {
                res.status(200).json({
                    status: success.status,
                    message: success.message,
                    data: success.data
                });
            }
        });
    },

    getMealById: (req, res, next) => {
        logger.info('mealController: getByID', req.params.mealId);
        mealService.getMealById(req.params.mealId, (error, success) => {
            if (error) {
                return next({
                    status: error.status,
                    message: error.message,
                    data: {}
                });
            }

            if (success) {
                res.status(200).json({
                    status: success.status,
                    message: success.message,
                    data: success.data
                });
            }
        });
    },

    deleteMealByID: (req, res, next) => {
        logger.info('mealController: deleteMealByID');
        const userID = req.userId;
        mealService.deleteMealById(req.params.mealId, userID, (error, success) => {
            if (error) {
                return next({
                    status: error.status,
                    message: error.message,
                    data: {}
                });
            }

            if (success) {
                res.status(200).json({
                    status: success.status,
                    message: success.message,
                    data: success.data
                });
            }
        });
    }
}

module.exports = mealController;