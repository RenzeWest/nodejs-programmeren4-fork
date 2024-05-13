const logger = require('../util/logger')
const tokenService = require('../services/token.service')

const tokenController = {

    login: (req, res, next) => {
        const userCreds = req.body;
        logger.debug('login', userCreds);

        tokenService.login(userCreds, (error, succes) => {
            
            if (error) {
                return next({
                    status: error.status,
                    message: error.message,
                    data: {}
                });
            }

            if (succes) {
                res.status(200).json({
                    status: succes.status,
                    message: succes.message,
                    data: succes.data
                });
            }
        })


    }
}

module.exports = tokenController;