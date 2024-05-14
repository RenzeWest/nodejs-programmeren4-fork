const { getMealById } = require('../controllers/meal.controller');
const mysqlDatabase = require('../dao/mysql-database')
const logger = require('../util/logger')

const mealService = {
    createMeal: (meal, userId,callback) => {
        mysqlDatabase.getConnection(function(err, connection) {
            if (err) {
                logger.error(err);
                callback(err, null);
                return;

            }

            connection.query('INSERT INTO `meal`(`isActive`, `isVega`, `isVegan`, `isToTakeHome`, `dateTime`, `maxAmountOfParticipants`, `price`, `imageUrl`, `cookId`, `name`, `description`, `allergenes`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);',
                [meal.isActive, meal.isVega, meal.isVegan, meal.isToTakeHome, meal.dateTime, meal.maxAmountOfParticipants, meal.price, meal.imageUrl, userId, meal.name, meal.description, meal.allergenes],            
                function (error, results) {

                if (error) {
                    logger.error(error);
                    connection.release();
                    callback(error, null);

                } else {
                    logger.debug(results);
                    
                    connection.query('SELECT * FROM `meal` WHERE id = ?;', [results.insertId], (err, results) => {
                        connection.release();
                        if (err) {
                            logger.error(err);
                            call(error, null);

                        } else {
                            logger.info(`meal succesfully created with id ${results[0].id}`)
                            callback(null, {
                                status: 201,
                                message: 'Meal succesfully created with id ' + results[0].id,
                                data: results[0]
                            });

                        }
                    });
                }
            });
        });
    },

    getMealById: (mealId, callback) => {

        mysqlDatabase.getConnection(function(err, connection) {
            if (err) {
                logger.error(err);
                callback(err, null);
                return;

            }

            connection.query('SELECT * FROM `meal` WHERE id = ?;', [mealId], (err, results) => {
                connection.release();
                if (err) {
                    logger.error(err);
                    call(error, null);

                } else if (results && results.length > 0) {
                    logger.info(`Found a meal with ID ${mealId}`)
                    callback(null, {
                        status: 200,
                        message: 'Found a meal with ID ' + mealId,
                        data: results[0]
                    });

                } else {
                    logger.debug(results)
                    callback({status: 404, message: `Error: id ${mealId} does not exist!` }, null)

                }
            });
        });
    },
    
    getAllMeals: (callback) => {
        mysqlDatabase.getConnection(function(err, connection) {
            if (err) {
                logger.error(err);
                callback(err, null);
                return;

            }

            connection.query('SELECT * FROM `meal`;', (err, results) => {
                connection.release();
                if (err) {
                    logger.error(err);
                    call(error, null);

                } else if (results && results.length > 0) {
                    logger.info(`Found ${results.length} meals`)
                    callback(null, {
                        status: 200,
                        message: 'Found ' + results.length + ' meals',
                        data: results
                    });

                } else {
                    logger.debug(results)
                    callback({status: 404, message: `Error: No meals found` }, null)
                }
            });
        });
    },

    deleteMealById: (mealId, userId, callback) => {
        logger.info("service: Delete meal ", mealId , " ,userID ", userId)
        mysqlDatabase.getConnection(function(err, connection) {
            if (err) {
                logger.error(err);
                callback(err, null);
                return;

            }

            // Check if the meal exists
            connection.query('SELECT * FROM `meal` WHERE id = ?;', [mealId], (erro, results) => {
                if (erro) {
                    connection.release();
                    logger.error(erro);
                    call(erro, null);

                } else if (results && results.length > 0) {
                    // TODO: Check if owner
                    if (results[0].cookId !== userId) {
                        connection.release();
                        logger.info('User is not the owner of the meal (', results[0].cookId, " != ", userId, ")");
                        callback({status: 403, message: "Not owner of the data", data: {}})
                        return;
                    }

                    // TODO: Delete meal
                    connection.query('DELETE FROM `meal` WHERE id = ?', [mealId], (err, results) => {
                        connection.release();
                        if (err) {
                            callback(error, null);
                        } else {
                            logger.info('Deleted user with id ', mealId)
                            callback({
                                status: 200,
                                message: `Deleted meal with ID: ${mealId}`,
                                data: {}
                            }, null);
                        }
                    });

                } else {
                    logger.debug(results)
                    callback({status: 404, message: `Error: id ${mealId} does not exist!` }, null)

                }
            });
        });
    }
}




module.exports = mealService;

/*
Base for database connection
mysqlDatabase.getConnection(function(err, connection) {
    if (err) {
        logger.error(err);
        callback(err, null);
        return;
    }

    connection.query('Query', function (error, results, fields) {
        connection.release();

        if (error) {
            logger.error(error);
            callback(error, null);
        } else {
            logger.debug(results);
            callback(null, {

            });
        }

    });
});
*/