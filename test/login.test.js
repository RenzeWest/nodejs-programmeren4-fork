const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../index')
const tracer = require('tracer')

chai.should()
chai.use(chaiHttp)
tracer.setLevel('warn')

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
    'INSERT INTO user (id, firstName, lastName, emailAdress, password, street, city, isActive ) VALUES' +
    '(1, "first", "last", "f.name@server.nl", "P9k!llak", "street", "city", 1), ' + 
    '(3, "first", "last", "f.name@avans.nl", "P9k!llak", "street", "city", 1), ' + 
    '(2, "last", "first", "l.name@server.nl", "P0l.skA", "street", "city", 0);'

/**
 * Query om twee meals toe te voegen. Let op de cookId, die moet matchen
 * met een bestaande user in de database.
 */
const INSERT_MEALS =
    'INSERT INTO meal (id, name, description, imageUrl, dateTime, maxAmountOfParticipants, price, cookId) VALUES' +
    "(1, 'Meal A', 'description', 'image url', NOW(), 5, 6.50, 1)," +
    "(2, 'Meal B', 'description', 'image url', NOW(), 5, 6.50, 1);"

const jwt = require(`jsonwebtoken`)
const jwtSecretKey = require('../src/util/config').secretkey

const endpointToTest = '/api/login/'

describe('UC-101 Inloggen', () => {

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

    it('TC-101-1 Verplicht veld ontbreekt', (done) => {
        chai.request(server)
            .post(endpointToTest)
            .send({
                // password: '',
                emailAdress: '' 
            })
            .end((err, res) => {
                // Controleerd of de status 400 is
                chai.expect(res).to.have.status(400);

                const resB = res.body;

                // Test of het een object is met een status en een data object
                chai.expect(resB).to.be.a('object');
                chai.expect(resB).to.have.property('status').equals(400);
                chai.expect(resB).to.have.property('data').to.be.empty      

                done();
            })
    })

    it('TC-101-2 Niet-valide wachtwoord', (done) => {
        chai.request(server)
            .post(endpointToTest)
            .send({
                password: 'a',
                emailAdress: 'f.name@server.nl' 
            })
            .end((err, res) => {
                // Controleerd of de status 404 is
                chai.expect(res).to.have.status(404);

                const resB = res.body;

                // Test of het een object is met een status en een data object
                chai.expect(resB).to.be.a('object');
                chai.expect(resB).to.have.property('status').equals(404);
                chai.expect(resB).to.have.property('message').that.is.a('string').equals('User not found or password invalid')
                chai.expect(resB).to.have.property('data').that.is.a('object').that.is.empty     

                done();
            })
    })

    it('TC-101-3 Gebuiker bestaat niet', (done) => {
        chai.request(server)
            .post(endpointToTest)
            .send({
                password: 'secret',
                emailAdress: 'nietBestaandEmail' 
            })
            .end((err, res) => {
                // Controleerd of de status 404 is
                chai.expect(res).to.have.status(404);

                const resB = res.body;

                // Test of het een object is met een status en een data object
                chai.expect(resB).to.be.a('object');
                chai.expect(resB).to.have.property('status').equals(404);
                chai.expect(resB).to.have.property('message').that.is.a('string').equals('User not found or password invalid')
                chai.expect(resB).to.have.property('data').that.is.a('object').that.is.empty               

                done();
            })
    })

    it('TC-101-4 Gebruiker succesvol ingelogd', (done) => {
        chai.request(server)
            .post(endpointToTest)
            .send({
                password: 'P9k!llak',
                emailAdress: 'f.name@server.nl' 
            })
            .end((err, res) => {
                // Controleerd of de status 200 is
                chai.expect(res).to.have.status(200);

                const resB = res.body;

                // Test of het een object is met een status en een data object
                chai.expect(resB).to.be.a('object');
                chai.expect(resB).to.have.property('status').equals(200);
                chai.expect(resB).to.have.property('message').that.is.a('string').equals('User logged in')
                chai.expect(resB).to.have.property('data').that.is.a('object').that.is.not.empty
                chai.expect(resB.data).to.have.property('token').that.is.a('string').that.is.not.empty
                chai.expect(res.body.data).to.have.property('firstName').that.is.not.empty
                chai.expect(res.body.data).to.have.property('lastName').that.is.not.empty
                chai.expect(res.body.data).to.have.property('emailAdress').that.is.not.empty

                done();
            })
    })

    
})