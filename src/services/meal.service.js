const { getMealById } = require('../controllers/meal.controller');
const mysqlDatabase = require('../dao/mysql-database')
const logger = require('../util/logger')

const mealService = {
    createMeal: (meal, callback) => {
        mysqlDatabase.getConnection(function(err, connection) {
            if (err) {
                logger.error(err);
                callback(err, null);
                return;

            }

            connection.query('INSERT INTO `meal`(`isActive`, `isVega`, `isVegan`, `isToTakeHome`, `dateTime`, `maxAmountOfParticipants`, `price`, `imageUrl`, `cookId`, `name`, `description`, `allergenes`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);',
                [meal.isActive, meal.isVega, meal.isVegan, meal.isToTakeHome, meal.dateTime, meal.maxAmountOfParticicpants, meal.price, meal.imageUrl, meal.cookId, meal.name, meal.description, meal.allergenes],            
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
                                status: 200,
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