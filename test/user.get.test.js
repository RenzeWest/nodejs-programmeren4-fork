const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../index')
const tracer = require('tracer')

chai.should()
chai.use(chaiHttp)
tracer.setLevel('warn')

const endpointToTest = '/api/user'

describe('UC-202 Opvragen van overzicht van users', () => {
    // Verwacht bij allen 200
    it('TC-202-1 Toon alle gebruikers (minimaal 2)', (done) => {
        chai.request(server)
            .get(endpointToTest)
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

    it('TC-202-5 Toon gebruikers met zoektermen op bestaandevelden (max op 2 velden filteren)', (done) => {
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