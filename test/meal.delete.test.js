const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../index')
const tracer = require('tracer')

chai.should()
chai.use(chaiHttp)
tracer.setLevel('warn')

const jwt = require(`jsonwebtoken`)
const jwtSecretKey = require('../src/util/config').secretkey

const db = require('../src/dao/mysql-database')

/**
 * Db queries to clear and fill the test database before each test.
 */
const CLEAR_MEAL_TABLE = 'DELETE IGNORE FROM meal;'
const CLEAR_PARTICIPANTS_TABLE = 'DELETE IGNORE FROM meal_participants_user;'
const CLEAR_USERS_TABLE = 'DELETE IGNORE FROM user;'
const CLEAR_DB = CLEAR_MEAL_TABLE + CLEAR_PARTICIPANTS_TABLE + CLEAR_USERS_TABLE

/**
 * Voeg een user toe aan de database. Deze user heeft id 1.
 * Deze id kun je als foreign key gebruiken in de andere queries, bv insert meal.
 */
const INSERT_USER =
    'INSERT INTO user (id, firstName, lastName, emailAdress, password, street, city ) VALUES' +
    '(1, "first", "last", "f.name@server.nl", "P9k!llak", "street", "city"), ' + 
    '(2, "last", "first", "l.name@server.nl", "P0l.skA", "street", "city");'

/**
 * Query om twee meals toe te voegen. Let op de cookId, die moet matchen
 * met een bestaande user in de database.
 */
const INSERT_MEALS =
    'INSERT INTO meal (id, name, description, imageUrl, dateTime, maxAmountOfParticipants, price, cookId) VALUES' +
    "(1, 'Meal A', 'description', 'image url', NOW(), 5, 6.50, 1)," +
    "(2, 'Meal B', 'description', 'image url', NOW(), 5, 6.50, 1);"

const endpointToTest = '/api/meal/'

describe('UC-305 Verwijderen van maaltijd', () => {

    beforeEach((done) => {
            // maak de testdatabase leeg zodat we onze testen kunnen uitvoeren.
            db.getConnection(function (err, connection) {
                if (err) throw err // not connected!

                // Use the connection
                connection.query(
                    CLEAR_DB + INSERT_USER + INSERT_MEALS,
                    function (error, results, fields) {
                        // When done with the connection, release it.
                        connection.release()

                        // Handle error after the release.
                        if (error) throw error
                        // Let op dat je done() pas aanroept als de query callback eindigt!
                        done()
                    }
                )
            })
    })

    it('TC-305-1 Niet ingelogd', (done) => {
        // verwacht 401
        const token = jwt.sign({ userId: 1 }, jwtSecretKey)
        chai.request(server)
            .delete(endpointToTest + 1)
            .set('Authorization', 'Bearer ')
            .end((err, res) => {
                // Controleerd of de status 401 is
                chai.expect(res).to.have.status(401);
                chai.expect(res).not.to.have.status(200);

                // Test of het een object is met een status en een data object
                chai.expect(res.body).to.be.a('object');
                chai.expect(res.body).to.have.property('status').equals(401);
                chai.expect(res.body).to.have.property('data').that.is.a('object').that.is.empty;
                chai.expect(res.body).to.have.property('message').equals('Not authorized')

                done();
            })
    })

    it('TC-305-2 Niet de eigenaar van de data', (done) => {
        // verwacht 403
        const token = jwt.sign({ userId: 1000 }, jwtSecretKey)
        chai.request(server)
            .delete(endpointToTest + 2)
            .set('Authorization', 'Bearer ' + token)
            .end((err, res) => {
                // Controleerd of de status 403 is
                chai.expect(res).to.have.status(403);
                chai.expect(res).not.to.have.status(200);

                // Test of het een object is met een status en een data object
                chai.expect(res.body).to.be.a('object');
                chai.expect(res.body).to.have.property('status').equals(403);
                chai.expect(res.body).to.have.property('data').that.is.a('object').that.is.empty;
                chai.expect(res.body).to.have.property('message').equals('Not owner of the data')

                done();
            })
    })

    it('TC-305-3 Maaltijd bestaat niet', (done) => {
        // verwacht 404
        const token = jwt.sign({ userId: 1 }, jwtSecretKey)
        chai.request(server)
            .delete(endpointToTest + 1000)
            .set('Authorization', 'Bearer ' + token)
            .end((err, res) => {
                // Controleerd of de status 404 is
                chai.expect(res).to.have.status(404);
                chai.expect(res).not.to.have.status(200);

                // Test of het een object is met een status en een data object
                chai.expect(res.body).to.be.a('object');
                chai.expect(res.body).to.have.property('status').equals(404);
                chai.expect(res.body).to.have.property('data').that.is.a('object').that.is.empty;
                chai.expect(res.body).to.have.property('message').equals('Error: id 1000 does not exist!')

                done();
            })
    })

    it('TC-305-4 Maaltijd succesvol verwijderd', (done) => {
        const token = jwt.sign({ userId: 1 }, jwtSecretKey)
        chai.request(server)
            .delete(endpointToTest + 1)
            .set('Authorization', 'Bearer ' + token)
            .end((err, res) => {
                // Controleerd of de status 200 is
                chai.expect(res).to.have.status(200);
                chai.expect(res).not.to.have.status(404);

                // Test of het een object is met een status en een data object
                chai.expect(res.body).to.be.a('object');
                chai.expect(res.body).to.have.property('status').equals(200);
                chai.expect(res.body).to.have.property('data').that.is.a('object').that.is.empty;
                chai.expect(res.body).to.have.property('message').equals('Deleted meal with ID: 1')

                done();
            })
    })


})