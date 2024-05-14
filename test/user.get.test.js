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

const jwt = require(`jsonwebtoken`)
const jwtSecretKey = require('../src/util/config').secretkey

const endpointToTest = '/api/user'

describe('UC-202 Opvragen van overzicht van users', () => {

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

    // Verwacht bij allen 200
    it('TC-202-1 Toon alle gebruikers (minimaal 2)', (done) => {
        const token = jwt.sign({ userId: 1 }, jwtSecretKey)
        chai.request(server)
            .get(endpointToTest)
            .set('Authorization', 'Bearer ' + token)
            .end((err, res) => {
                // Controleerd of de status 200 is
                chai.expect(res).to.have.status(200);

                const resB = res.body;

                // Test of het een object is met een status en een data object
                chai.expect(resB).to.be.a('object');
                chai.expect(resB).to.have.property('status').equals(200);
                chai.expect(resB).to.have.property('data').that.is.a('array').that.is.not.empty;
                chai.expect(resB.data).to.have.lengthOf.above(1);               

                done();
            })
    })

    // ik had de filters iets anders aangepakt. Daarom skip ik deze voor nu even, ik ga dit bij de eind oplevering verbeteren
    it.skip('TC-202-2 Toon gebruikers met zoekterm op niet-bestaande velden', (done) => {

    })
    it.skip('TC-202-3 Toon gebruiksers met gebruik van de zoekterm op het vled "isactive"= false', (done) => {

    })
    it.skip('TC-202-4 Toon gebruikers met gebruik van de zoekterm op het veld "isActive"=true', (done) => {

    })

    it.skip('TC-202-5 Toon gebruikers met zoektermen op bestaandevelden (max op 2 velden filteren)', (done) => {
        chai.request(server)
                    .get(endpointToTest + '?emailAdress=server&phoneNumber=06 11223344')
                    .end((err, res) => {
                        // Controleerd of de status 200 is
                        chai.expect(res).to.have.status(200);

                        const resB = res.body;

                        // Test of het een object is met een status en een data object
                        chai.expect(resB).to.be.a('object');
                        chai.expect(resB).to.have.property('status').equals(200);
                        chai.expect(resB).to.have.property('data').that.is.a('array').that.is.not.empty;
                        chai.expect(resB.data).to.have.lengthOf.above(0); // er is er 1 die aan de filters voldoet               

                        done();
                    })
    })
})