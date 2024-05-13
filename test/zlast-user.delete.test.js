const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../index')
const tracer = require('tracer')

chai.should()
chai.use(chaiHttp)
tracer.setLevel('warn')

const endpointToTest = '/api/user/'

describe('UC-206 Verwijderen van user', () => {

    beforeEach((done) => {
        console.log('Before each test')

        done()
    })

    it('TC-206-1 Gebruiker bestaat niet', (done) => {
        // Verwacht 404
        chai.request(server)
            .delete(endpointToTest + '-1')
            .end((err, res) => {
                // Controleerd of de status 404 is
                chai.expect(res).to.have.status(404);

                const resB = res.body;

                // Test of het een object is met een status en een data object
                chai.expect(resB).to.be.a('object');
                chai.expect(resB).to.have.property('status').equals(404);
                chai.expect(resB).to.have.property('data').that.is.a('object').that.is.empty;
                chai.expect(resB).to.have.property('message').equals('Error: id -1 does not exist!');

                done();
            })
    })

    it.skip('TC-206-2 Gebruiker is niet ingelogd', (done) => {
        // Verwacht 401
    })

    it.skip('TC-206-3 De gebruiker is niet de eigenaar van de data', (done) => {
        // Verwacht 403
    })

    it('TC-206-4 Geburiker succesvol verwijderd', (done) => {
        // Verwacht 200
        chai.request(server)
            .delete(endpointToTest + '83')
            .end((err, res) => {
                // Controleerd of de status 200 is
                chai.expect(res).to.have.status(200);

                const resB = res.body;

                // Test of het een object is met een status en een data object
                chai.expect(resB).to.be.a('object');
                chai.expect(resB).to.have.property('status').equals(200);
                chai.expect(resB).to.have.property('data').that.is.a('object').that.is.empty;

                done();
            })
    })

})