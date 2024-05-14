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

        // Ik ga ervanuit dat ik maar 2 filters hoef te verzorgen en dat ik deze zelf mag kiezen
        if (req.query.emailAdress && req.query.phoneNumber) { // Beide filters zijn aanwezig
            userService.getByFilters(req.query.emailAdress, req.query.phoneNumber, (error, success) => {
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
        } else if (req.query.emailAdress) { // Alleen email is aanwezig
            userService.getByFilters(req.query.emailAdress, null, (error, success) => {
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
        } else if (req.query.phoneNumber) { // Alleen phoneNumber is aanwezig
            userService.getByFilters(null, req.query.phoneNumber, (error, success) => {
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
        } else { // er zijn geen filters dus er kan ongefilterd gezocht worden (of er zijn filters opgegeven die niet bestaan)
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
