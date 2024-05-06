const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../index')
const tracer = require('tracer')

chai.should()
chai.use(chaiHttp)
tracer.setLevel('warn')

const endpointToTest = '/api/user'

describe('UC201 Registreren als nieuwe user', () => {
    /**
     * Voorbeeld van een beforeEach functie.
     * Hiermee kun je code hergebruiken of initialiseren.
     */
    beforeEach((done) => {
        console.log('Before each test')
        done()
    })

    /**
     * Hier starten de testcases
     */
    it('TC-201-1 Verplicht veld ontbreekt', (done) => {
        chai.request(server)
            .post(endpointToTest)
            .send({
                // firstName: 'Voornaam', ontbreekt
                lastName: 'Achternaam',
                emailAdress: 'v.a@server.nl'
            })
            .end((err, res) => {
                chai.expect(res).to.have.status(400)
                chai.expect(res).not.to.have.status(200)
                chai.expect(res.body).to.be.a('object')
                chai.expect(res.body).to.have.property('status').equals(400)
                chai.expect(res.body)
                    .to.have.property('message')
                    .matches(/^Missing firstName field/) // Controleer of de error op firstName field viel (door te kijken of een deel matched)
                chai
                    .expect(res.body)
                    .to.have.property('data')
                    .that.is.a('object').that.is.empty

                done()
            })
    })

    it('TC-201-2 Niet-valide email adres', (done) => {
        chai.request(server)
            .post(endpointToTest)
            .send({
                firstName: 'rob',
                lastName: 'Van Dam',
                emailAdress: 'm.s@aaasaa.nl',
                password: 'S13ecret',
                isActive: true,
                street: 'Lovensdijkstraat 61',
                city: 'Breda',
                phoneNumber: '06 12345678',
                roles: []
            })
            .end((err, res) => {

                chai.expect(res).to.have.status(400)
                chai.expect(res).not.to.have.status(200)
                chai.expect(res.body).to.be.a('object')
                chai.expect(res.body).to.have.property('status').equals(400)
                chai.expect(res.body)
                    .to.have.property('message')
                    .matches(/email not valid/) 
                chai
                    .expect(res.body)
                    .to.have.property('data')
                    .that.is.a('object').that.is.empty

                done()
            })
    })

    it('TC-201-3 Niet-valide password', (done) => {
        chai.request(server)
            .post(endpointToTest)
            .send({
                firstName: 'rob',
                lastName: 'Van Dam',
                emailAdress: 'm.as@aaasaa.nl',
                password: 'a',
                isActive: true,
                street: 'Lovensdijkstraat 61',
                city: 'Breda',
                phoneNumber: '06 12345678',
                roles: []
            })
            .end((err, res) => {

                chai.expect(res).to.have.status(400)
                chai.expect(res).not.to.have.status(200)
                chai.expect(res.body).to.be.a('object')
                chai.expect(res.body).to.have.property('status').equals(400)
                chai.expect(res.body)
                    .to.have.property('message')
                    .matches(/password not strong enough/) 
                chai
                    .expect(res.body)
                    .to.have.property('data')
                    .that.is.a('object').that.is.empty

                done()
            })
    })

    it('TC-201-4 Gebruiker bestaat al', (done) => {
        chai.request(server)
            .post(endpointToTest)
            .send({
                id: 4,
                firstName: 'Lola',
                lastName: 'Ozen',
                emailAdress: 'l.oz@server.nl',
                password: 'Wad147LoOz!',
                isActive: true,
                street: 'Tweede Bloksweg 147', 
                city: 'Waddinxveen',
                phoneNumber: '06 52250043',
                roles: ['role1', 'role2']
            })
            .end((err, res) => {

                chai.expect(res).to.have.status(400)
                chai.expect(res).not.to.have.status(200)
                chai.expect(res.body).to.be.a('object')
                chai.expect(res.body).to.have.property('status').equals(400)
                chai.expect(res.body)
                    .to.have.property('message')
                    .equals('Email (l.oz@server.nl) already in use!') 
                chai
                    .expect(res.body)
                    .to.have.property('data')
                    .that.is.a('object').that.is.empty

                done()
            })
    })

    it('TC-201-5 Gebruiker succesvol geregistreerd', (done) => {
        chai.request(server)
            .post(endpointToTest)
            .send({
                "firstName": "Voornaam",
                "lastName": "Achternaam",
                "emailAdress": "m.as@aaasaa.nl",
                "password": "S13ecret",
                "isActive": true,
                "street": "Lovensdijkstraat 61",
                "city": "Breda",
                "phoneNumber": "06 12345678",
                "roles": []
            })
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.be.a('object')

                res.body.should.have.property('data').that.is.a('object')
                res.body.should.have.property('message').that.is.a('string')

                const data = res.body.data
                data.should.have.property('firstName').equals('Voornaam')
                data.should.have.property('lastName').equals('Achternaam')
                data.should.have.property('emailAdress')
                data.should.have.property('id').that.is.a('number')

                done()
            })
    })
})
