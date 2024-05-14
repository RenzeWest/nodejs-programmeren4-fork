const database = require('../dao/inmem-db')
const mysqlDatabase = require('../dao/mysql-database')
const logger = require('../util/logger')

const userService = {
    // Method to call mySQL database
    getAll: (callback) => {
        logger.info('Get all users')
        mysqlDatabase.getConnection((err, connection) => {
            // Check of er een error is
            if (err) {
                logger.error(err)
                callback(err, null)
                return;
            }

            connection.query(
                'SELECT * FROM `user`',
                (error, results, fields) => {
                    // Query is uitgevoerd dus geef de verbinding weer vrij
                    connection.release()

                    if (error) {
                        logger.error(error)
                        callback(error, null)
                        return;
                    } else {
                        logger.debug(results)
                        callback(null, {
                            status: 200,
                            message: `Found ${results.length} users.`,
                            data: results
                        })
                    }
                })
            })
    },

    create: (user, callback) => {
        logger.info('create user', user)

        mysqlDatabase.getConnection((err, connection) => {
            if (err) {
                logger.error(err);
                callback(err, null);
                return;
            }

            // Check if email is in use
            connection.query('SELECT * FROM `user` WHERE emailAdress = ?', [user.emailAdress], (error, results, fields) => {
                if (error) {
                    logger.error(error);
                    connection.release();
                    callback(error, null);
                    return;

                } else if (results && results.length > 0) {
                    logger.info('Email already in use')
                    callback({ status: 403, message: `Email (${user.emailAdress}) already in use!` }, null);
                    return;

                } else { // Email is not in use so you can insert the user
                    connection.query('INSERT INTO `user` (`firstName`, `lastName`, `isActive`, `emailAdress`, `password`, `phoneNumber`, `roles`, `street`, `city`) VALUES (?,?,?,?,?,?,?,?,?);', 
                    [user.firstName, user.lastName, user.isActive, user.emailAdress, user.password, user.phoneNumber, user.roles | 'none', user.street, user.city],
                    (error, results, fields) => {
                        connection.release();

                        if (error) {
                            logger.error(error);
                            callback(error, null);
                            return;

                        } else {
                            logger.debug(results[0]);

                            // Get the user
                            connection.query('SELECT * FROM `user` WHERE id = ?;', [results.insertId], (error, res, fields) => {
                                connection.release();

                                if (error) {
                                    logger.error(error);
                                    callback(error, null);

                                } else {
                                    logger.debug(res[0]);
                                    callback(null, {
                                        status: 201,
                                        message: `Created a user with ID: ${res[0].id}.`,
                                        data: res[0]
                                    });
                                }
                            });
                        }
                    });

                }
            });
        });
    },

    getById: (userID, callback) => {
        logger.info(`get by ID: ${userID}`)

        mysqlDatabase.getConnection((err, connection) => {
            if (err) {
                logger.error(err);
                callback(err, null);
                return;
            }

            connection.query('SELECT * FROM `user` WHERE id = ?;', [userID], (error, results, fields) => {
                connection.release();

                if (error) {
                    logger.error(error);
                    callback(error, null);
                } else if (results && results.length > 0){
                    let userDetail = results[0];

                    // Get connected Meals
                    connection.query('SELECT * FROM `meal` WHERE cookId = ?', [userID], (err, results) => { // Ik doe voor nu ook even maaltijden die in het verleden hebben plaats gevonden aangezien de meal data allemaal 2022 is
                        connection.release();
                        if (err) {
                            logger.error(err);
                            callback(error, null);
                        } else if (results && results.length > 0) {
                            
                            userDetail = Object.assign(userDetail, {meals: results})

                            callback(null, {
                                status: 200,
                                message: `Found a user with ID: ${userID}.`,
                                data: userDetail
                            })
                        } else {
                            userDetail = Object.assign(userDetail, {meals: "No meals found"})
                            callback(null, {
                                status: 200,
                                message: `Found a user with ID: ${userID}.`,
                                data: userDetail
                            })
                        }
                    });
                    
                } else {
                    logger.debug(results)
                    callback({status: 404, message: `Error: id ${userID} does not exist!` }, null)
                }

            });
        });
    },

    updateById: (userID, user, callback) => {
        logger.info(`update by ID: ${userID}`);

        mysqlDatabase.getConnection((err, connection) => {
            if (err) {
                logger.error(err);
                callback(err, null);
                return;
            }

            // Check if the user exists
            connection.query('SELECT * FROM `user` WHERE id = ?;', [userID], (error, results, fields) => {
                

                if (error) {
                    logger.error(error);
                    connection.release();
                    callback(error, null);
                } else if (results && results.length > 0) { // User exists
                    logger.debug(results);

                    // Check if email is already in use
                    connection.query('SELECT * FROM `user` WHERE emailAdress = ?', [user.emailAdress], (error, results) => {
                        if (error) {
                            logger.error(error);
                            connection.release();
                            callback(error, null);
                            return;

                        } else if (results && results.length > 0 && '' + results[0].id !== userID) {
                            logger.info('Email already in use')
                            callback({ status: 400, message: `Email (${user.emailAdress}) already in use!` }, null);
                            return;

                        } else { // Email is not already in use so you can update

                            connection.query('UPDATE `user` SET `firstName` = ?, `lastName` = ?, `isActive` = ?, `emailAdress` = ?,`password` = ?,`phoneNumber` = ?,`roles` = ?,`street` = ?,`city` = ? WHERE id = ?;', 
                            [user.firstName, user.lastName, user.isActive, user.emailAdress, user.password, user.phoneNumber, user.roles | 'none', user.street, user.city, userID], 
                            (error, results, fields) => {

                                if (error) {
                                    logger.error(error);
                                    connection.release();
                                    callback(error, null);
                                } else {
                                    logger.debug(results);

                                    // Get the updated user from the database
                                    connection.query('SELECT * FROM `user` WHERE id = ?;', [userID], (error, results, fields) => {
                                        connection.release();

                                        if (error) {
                                            logger.error(error);
                                            callback(error, null);

                                        } else if (results && results.length > 0){ 
                                            logger.debug(results);
                                            callback(null, {
                                                status: 200,
                                                message: `Updated a user with ID: ${userID}.`,
                                                data: results[0]
                                            });

                                        } else {
                                            logger.debug(results)
                                            callback({status: 404, message: `Error: id ${userID} does not exist!` }, null)
                                        }
                                    });
                                }

                            });
                        }
                    })
                } else {
                    logger.debug(results)
                    callback({status: 404, message: `Error: id ${userID} does not exist!` }, null)
                }
            });    
        });
    },

    deleteById: (userID, callback) => {

        mysqlDatabase.getConnection(function(err, connection) {
            if (err) {
                logger.error(err);
                callback(err, null);
                return;
            }

            // Check if user exists
            connection.query('SELECT * FROM `user` WHERE id = ?;', [userID], (error, results, fields) => {

                if (error) {
                    logger.error(error);
                    connection.release();
                    callback(error, null);

                } else if (results && results.length > 0){
                    logger.debug(results);

                    // Check if user has any meals connected
                    connection.query('SELECT * FROM `meal` WHERE cookId = ?', [userID], (erro, results) => {
                        if (erro) {
                            connection.release();
                            callback(erro, null);
                        } else if (results && results.length > 0) { // There are meals connected
                            connection.release();
                            callback({status: 400, message: 'User not deleted due to connected meals, please delete the meals first', data: results}, null);
                        } else {
                            // Delete User
                            connection.query('DELETE FROM `user` WHERE id = ?', [userID], (err, results) => {
                                connection.release();
                                if (err) {
                                    callback(err, null);
                                } else {
                                    logger.info('Deleted User')
                                    callback({
                                        status: 200,
                                        message: `Deleted user with ID: ${userID}`,
                                        data: {}
                                    }, null);
                                }
                            });
                        }
                    })
                    
                    

                } else {
                    logger.debug(results)
                    callback({status: 404, message: `Error: id ${userID} does not exist!` }, null)
                }

            });
        });
    },

    // Methods without mysql
    getByFilters: (email, phoneNumber, callback) => {
        logger.info(`Searching on email: ${email} and phoneNumber: ${phoneNumber}`);
        database.getByFilters(email, phoneNumber, (err, data) => {
                if (err) {
                    callback(err, null);
                } else {
                    callback(null, {
                        status: 200,
                        message: `Searched on filters ${email} & ${phoneNumber}. We found a total of ${data.length} users`,
                        data: data
                    });
                }
            })
        // if (email === null && phoneNumber) {

        // } else if (email && phoneNumber === null) {

        // } else {
            
        // }
        
    },

    getUserProfile: (userId, callback) => {
        logger.info(`get profile: ${userId}`)

        mysqlDatabase.getConnection((err, connection) => {
            if (err) {
                logger.error(err);
                callback(err, null);
                return;

            }

            connection.query('SELECT * FROM `user` WHERE id = ?;', [userId], (error, results, fields) => {

                if (error) {
                    logger.error(error);
                    connection.release();
                    callback(error, null);

                } else if (results && results.length > 0){
                    logger.debug(results);
                    let userDetail = results[0];

                    // Get connected Meals
                    connection.query('SELECT * FROM `meal` WHERE cookId = ?', [userId], (err, results) => { // Ik doe voor nu ook even maaltijden die in het verleden hebben plaats gevonden aangezien de meal data allemaal 2022 is
                        connection.release();
                        if (err) {
                            logger.error(err);
                            callback(error, null);
                        } else if (results && results.length > 0) {
                            
                            userDetail = Object.assign(userDetail, { meals: results })

                            callback(null, {
                                status: 200,
                                message: 'Found user profile',
                                data: userDetail
                            })
                        } else {
                            userDetail = Object.assign(userDetail, {meals: "No meals found"})
                            callback(null, {
                                status: 200,
                                message: `Found a user with ID: ${userID}.`,
                                data: userDetail
                            })
                        }
                    });

                } else {
                    logger.debug(results)
                    callback({status: 404, message: `Error: profile does not exist!` }, null)

                }

            });
        });
    }
}

module.exports = userService

// Base for database connection
// mysqlDatabase.getConnection(function(err, connection) {
//             if (err) {
//                 logger.error(err);
//                 callback(err, null);
//                 return;
//             }

//             connection.query('Query', function (error, results, fields) {
//                 connection.release();

//                 if (error) {
//                     logger.error(error);
//                     callback(error, null);
//                 } else {
//                     logger.debug(results);
//                     callback(null, {

//                     });
//                 }

//             });
//         });
