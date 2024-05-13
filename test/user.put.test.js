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
const CLEAR_MEAL_TABLE = 'DELETE IGNORE FROM `meal`;'
const CLEAR_PARTICIPANTS_TABLE = 'DELETE IGNORE FROM `meal_participants_user`;'
const CLEAR_USERS_TABLE = 'DELETE IGNORE FROM `user`;'
const CLEAR_DB = CLEAR_MEAL_TABLE + CLEAR_PARTICIPANTS_TABLE + CLEAR_USERS_TABLE

/**
 * Voeg een user toe aan de database. Deze user heeft id 1.
 * Deze id kun je als foreign key gebruiken in de andere queries, bv insert meal.
 */
const INSERT_USER =
    'INSERT INTO `user` (`id`, `firstName`, `lastName`, `emailAdress`, `password`, `street`, `city` ) VALUES' +
    '(1, "first", "last", "f.name@server.nl", "P9k!llak", "street", "city"), ' + 
    '(2, "last", "first", "l.name@server.nl", "P0l.skA", "street", "city");'

/**
 * Query om twee meals toe te voegen. Let op de cookId, die moet matchen
 * met een bestaande user in de database.
 */
const INSERT_MEALS =
    'INSERT INTO `meal` (`id`, `name`, `description`, `imageUrl`, `dateTime`, `maxAmountOfParticipants`, `price`, `cookId`) VALUES' +
    "(1, 'Meal A', 'description', 'image url', NOW(), 5, 6.50, 1)," +
    "(2, 'Meal B', 'description', 'image url', NOW(), 5, 6.50, 1);"

const endpointToTest = '/api/user/'

describe('UC205 Updaten van usergegevens', () => {

    beforeEach((done) => {
        console.log('beforeEach called')
            // maak de testdatabase leeg zodat we onze testen kunnen uitvoeren.
            db.getConnection(function (err, connection) {
                if (err) throw err // not connected!

                // Use the connection
                connection.query(
                    CLEAR_DB + INSERT_USER,
                    function (error, results, fields) {
                        // When done with the connection, release it.
                        connection.release()

                        // Handle error after the release.
                        if (error) throw error
                        // Let op dat je done() pas aanroept als de query callback eindigt!
                        console.log('beforeEach done')
                        done()
                    }
                )
            })
    })

    it('TC-205-1 Verplicht veld "emailAdress" ontbreekt', (done) => {
        // verwacht  400
        chai.request(server)
            .put(endpointToTest + 1)
            .send({
                firstName: 'Renze',
                lastName: 'Westerink',
                phoneNumber: '06 2915868'

            })
            .end((err, res) => {
                // Controleerd of de status 400 is
                chai.expect(res).to.have.status(400);
                chai.expect(res).not.to.have.status(200);

                // Test of het een object is met een status en een data object
                chai.expect(res.body).to.be.a('object');
                chai.expect(res.body).to.have.property('status').equals(400);
                chai.expect(res.body).to.have.property('data').that.is.a('object').that.is.empty;
                chai.expect(res.body).to.have.property('message').equals('No email has been entered')

                done();
            })
    })

    it.skip('TC-205-2 De gebruiker is niet de eigenaar van de data', (done) => {
        // verwacht 403
    })

    it('TC-205-3 Niet-valide telefoonnummber', (done) => {
        // verwacht 400
        chai.request(server)
            .put(endpointToTest + 1)
            .send({
                firstName: 'Renze',
                lastName: 'Westerink',
                emailAdress: 'r.gw@server.nl',
                phoneNumber: '06 2915868'

            })
            .end((err, res) => {
                // Controleerd of de status 400 is
                chai.expect(res).to.have.status(400);
                chai.expect(res).not.to.have.status(200);

                // Test of het een object is met een status en een data object
                chai.expect(res.body).to.be.a('object');
                chai.expect(res.body).to.have.property('status').equals(400);
                chai.expect(res.body).to.have.property('data').that.is.a('object').that.is.empty;
                chai.expect(res.body).to.have.property('message').equals('06 2915868 phoneNumber not valid')

                done();
            })
    })

    it('TC-205-4 Gebruiker bestaat niet', (done) => {
        chai.request(server)
            .put(endpointToTest + 10000)
            .send({
                firstName: 'Renze',
                lastName: 'Westerink',
                emailAdress: 'r.gw@server.nl',
                phoneNumber: '06 29158683'

            })
            .end((err, res) => {
                // Controleerd of de status 404 is
                chai.expect(res).to.have.status(404);
                chai.expect(res).not.to.have.status(200);

                // Test of het een object is met een status en een data object
                chai.expect(res.body).to.be.a('object');
                chai.expect(res.body).to.have.property('status').equals(404);
                chai.expect(res.body).to.have.property('data').that.is.a('object').that.is.empty;
                chai.expect(res.body).to.have.property('message').equals('Error: id 10000 does not exist!')

                done();
            })
    })  

    it.skip('TC-205-5 Niet ingelogd', (done) => {
        // verwacht 401
    })

    it('TC-205-6 Gebruiker succesvol gewijzigd', (done) => {
        // verwacht 200
        chai.request(server)
            .put(endpointToTest + 1)
            .send({
                "firstName": "Mark",
                "lastName": "Van Dam",
                "emailAdress": "m.vandm@server.nl",
                "password": "A8&jdhasdfas",
                "isActive": false,
                "street": "Lovensdijkstraat 61",
                "city": "Breda",
                "phoneNumber": "06 12312345",
                "roles": []
            })
            .end((err, res) => {
                // Controleerd of de status 200 is
                chai.expect(res).to.have.status(200)
                chai.expect(res).not.to.have.status(400)

                // Test of het een object is met een status en een data object
                chai.expect(res.body).to.be.a('object')
                chai.expect(res.body).to.have.property('status').equals(200)
                chai.expect(res.body).to.have.property('data').that.is.a('object').that.is.not.empty
                    
                // Test of het result matched met de input
                chai.expect(res.body.data).to.have.property('firstName').equals('Mark')
                chai.expect(res.body.data).to.have.property('lastName').equals('Van Dam')
                chai.expect(res.body.data).to.have.property('emailAdress').equals('m.vandm@server.nl')
                chai.expect(res.body.data).to.have.property('phoneNumber').equals('06 12312345')
                chai.expect(res.body.data).to.have.property('id').equals(1)

                done()
            })
    })
})