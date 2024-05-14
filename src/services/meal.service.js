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