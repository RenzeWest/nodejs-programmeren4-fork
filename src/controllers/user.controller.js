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
                res.status(201).json({
                    status: success.status,
                    message: success.message,
                    data: success.data
                });
            }
        })
    },

    getAll: (req, res, next) => {
        logger.trace('userContoller: getAll');
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
        userService.deleteById(req.params.userId, (error, success) => {
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

module.exports = userController;
