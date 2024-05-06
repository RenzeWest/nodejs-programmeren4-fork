const database = require('../dao/inmem-db')
const logger = require('../util/logger')

const userService = {
    create: (user, callback) => {
        logger.info('create user', user)
        database.add(user, (err, data) => {
            if (err) {
                logger.info('error creating user: ', err.message || 'unknown error')
                console.log(err.status)
                callback(err, null)
            } else {
                logger.trace(`User created with id ${data.id}.`)
                callback(null, {
                    status: 201,
                    message: `User created with id ${data.id}.`,
                    data: data
                })
            }
        })
    },

    getAll: (callback) => {
        logger.info('getAll')
        database.getAll((err, data) => {
            if (err) {
                callback(err, null)
            } else {
                callback(null, {
                    status: 200,
                    message: `Found all (${data.length}) users.`,
                    data: data
                })
            }
        })
    },

    getById: (userID, callback) => {
        logger.info(`get by ID: ${userID}`)
        database.getById(userID, (err, data) => {
            if (err) {
                callback(err, null);
            } else {
                callback(null, {
                    status: 200,
                    message: `Found a user with ID: ${userID}.`, 
                    data: data
                });
            }
        });
    },

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

    // getByOneFilter: (filter, callback) {
    //     const splitFilter = filter.split(":");
    //     if (splitFilter[0] === 'email') {

    //     } else if (splitFilter[0] === 'phoneNumber') {

    //     }
    // },

    updateById: (userID, user, callback) => {
        logger.info(`update by ID: ${userID}`);
        database.updateById(userID, user, (err, data) => {
            if (err) {
                callback(err, null);
            } else {
                
                callback(null, Object.assign({
                    status: 200,
                    message: `Updated user with ID: ${userID}`,
                    data: {}
                }, data));
            }
        })
    }, 

    deleteById: (userID, callback) => {
        logger.info(`delete by ID: ${userID}`);
        database.deleteById(userID, (err, data) => {
            if (err) {
                callback(err, null);
            } else {
                callback(null, {
                    status: 200,
                    message: `Deleted user with ID: ${userID}`,
                    data: data
                })
            }
        });
    }
}

module.exports = userService
