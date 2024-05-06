const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../index')
const tracer = require('tracer')

chai.should()
chai.use(chaiHttp)
tracer.setLevel('warn')

const endpointToTest = '/api/user/'

describe('UC-204 Opvragen van usergegevens bij ID', () => {

    it.skip('TC-204-1 Ongeldig token', (done) => {
        // Verwacht 401
    })

    it('TC-204-2 Gebruiker-ID bestaat niet', (done) => {
        chai.request(server)
        // Verwacht 404
            .get(endpointToTest + '-1')
            .end((err, res) => {
                // Controleerd of de status 404 is
                chai.expect(res).to.have.status(404);

                const resB = res.body;

                // Test of het een object is met een status en een data object
                chai.expect(resB).to.be.a('object');
                chai.expect(resB).to.have.property('status').equals(404);
                chai.expect(resB).to.have.property('data').that.is.a('object').that.is.empty;
                chai.expect(resB).to.have.property('message').equals('Error: id -1 does not exist!')

                done();
            })
    })

    it('TC-204-3 Gebruiker-ID bestaat', (done) => {
        // Verwacht 200
        chai.request(server)
            .get(endpointToTest + '1')
            .end((err, res) => {
                // Controleerd of de status 200 is
                chai.expect(res).to.have.status(200);

                const resB = res.body;

                // Test of het een object is met een status en een data object
                chai.expect(resB).to.be.a('object');
                chai.expect(resB).to.have.property('status').equals(200);
                chai.expect(resB).to.have.property('data').that.is.a('object').that.is.not.empty;

                done();
            })
    })


})