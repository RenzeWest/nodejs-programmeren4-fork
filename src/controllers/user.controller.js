const userService = require('../services/user.service');
const logger = require('../util/logger');

let userController = {
    create: (req, res, next) => {
        const user = req.body;
        logger.info('userContoller: create user', user.firstName, user.lastName);
        userService.create(user, (error, success) => {
            if (error) {
                return next({
                    status: error.status,
                    message: error.message,
                    data: {}
                });
            }

            if (success) {
                res.status(success.status).json({
                    status: success.status,
                    message: success.message,
                    data: success.data
                });
            }
        })
    },

    getUsers: (req, res, next) => {
        logger.trace('userContoller: getAll');

        const queryField = Object.entries(req.query); // Haalt de query parameters uit het request

        if (queryField.length > 0 && queryField.length < 3) { // Er zijn filters aanwezig
            userService.getByFilters(queryField, (error, success) => {
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
            })

        } else if (queryField.length > 2) {
            // Er zijn teveel filters opgegeven
            res.status(200).json({
                        status: 200,
                        message: 'You have entered to many query parameters',
                        data: {}
                    });
        } else { 
            // Er zijn geen filters aanwezig
            userService.getAll((error, success) => {
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
            })
        }
    },

    getById: (req, res, next) => {
        const userId = req.params.userId;
        logger.trace('userController: getById', userId);
        userService.getById(userId, (error, success) => {
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
        })
    },
    
    updateById: (req, res, next) => {
        const userId = req.params.userId;
        const user = req.body;
        logger.trace('userContoller: updateById', userId);
        userService.updateById(userId, user, (error, success) => {
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
        }) 
        

    },

    deleteById: (req, res, next) => {
        const userId = req.params.userId;
        logger.trace('userContoller deleteById', userId);
        userService.deleteById(userId, (error, success) => {
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

    getUserProfile: (req, res, next) => {
        const userId = req.userId;
        logger.trace('Get user profile', userId);
        
        userService.getUserProfile(userId, (error, success) => {
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
        })
    }
}

module.exports = userController;
