const mealService = require('../services/meal.service');
const logger = require('../util/logger');

let mealController = {

    createMeal: (req, res, next) => {
        const meal = req.body;
        logger.info('mealController: createMeal', meal.name);
        
        mealService.createMeal(meal, (error, success) => {
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

    getAllMeals: (req, res, next) => {

    },

    getMealById: (req, res, next) => {

    },

    deleteMeal: (req, res, next) => {

    }
}

module.exports = mealController;

// mealService.create(user, (error, success) => {
//     if (error) {
//         return next({
//             status: error.status,
//             message: error.message,
//             data: {}
//         });
//     }

//     if (success) {
//         res.status(200).json({
//             status: success.status,
//             message: success.message,
//             data: success.data
//         });
//     }
// })