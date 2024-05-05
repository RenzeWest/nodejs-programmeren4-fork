//
// Onze lokale 'in memory database'.
// We simuleren een asynchrone database met een array van objecten.
// De array bevat een aantal dummy records.
// De database heeft twee methoden: get en add.
// Opdracht: Voeg de overige methoden toe.

const { updateById, deleteById } = require("../services/user.service");

const database = {
    // het array met dummy records. Dit is de 'database'.
    _data: [
        {
            id: 0,
            firstName: 'Hendrik',
            lastName: 'van Dam',
            emailAdress: 'hvd@server.nl',
            password: '$uperm4n!',
            isActive: true,
            street: 'Bloemendalstraat 17', 
            city: 'Meppel',
            phoneNumber: '06 87654321',
            roles: ['role1', 'role2']
        },
        {
            id: 1,
            firstName: 'Marieke',
            lastName: 'Jansen',
            emailAdress: 'mj@server.nl',
            password: 'K0n3!n',
            isActive: true,
            street: 'Binnenweg 35', 
            city: 'Maarssen',
            phoneNumber: '06 11223344',
            roles: ['role1', 'role2']
        },
        {
            id: 2,
            firstName: 'Jaap',
            lastName: 'Doven',
            emailAdress: 'jd@server.nl',
            password: 'Po0)*aS.@1',
            isActive: true,
            street: 'Noorderlichtplein 4', 
            city: 'Sittard',
            phoneNumber: '06 54326541',
            roles: ['role1', 'role2']
        },
        {
            id: 3,
            firstName: 'Peter',
            lastName: 'Smeets',
            emailAdress: 'ps@server.nl',
            password: 'Smeets123Peter',
            isActive: true,
            street: 'Sint Willebrordusstraat 118', 
            city: 'Zundert',
            phoneNumber: '06 73552328',
            roles: ['role1', 'role2']
        },
        {
            id: 4,
            firstName: 'Lola',
            lastName: 'Ozen',
            emailAdress: 'lo@server.nl',
            password: 'Wad147LoOz!',
            isActive: true,
            street: 'Tweede Bloksweg 147', 
            city: 'Waddinxveen',
            phoneNumber: '06 52250043',
            roles: ['role1', 'role2']
        }
    ],

    // Ieder nieuw item in db krijgt 'autoincrement' index.
    // Je moet die wel zelf toevoegen aan ieder nieuw item.
    _index: 5,
    _delayTime: 500,

    add(item, callback) {
        // Simuleer een asynchrone operatie
        setTimeout(() => {            

            if (!database.isEmailAvailable(item.emailAdress)) {
                callback({ status: 400, message: `Email (${item.emailAdress}) already in use!` }, null);
                return;
            }
            // Voeg een id toe en voeg het item toe aan de database
            let userFinal = Object.assign({id: this._index++}, item); // Ik heb het toevoegen van de ID zo gedaan, zodat het in het juiste format is
            
            // Voeg item toe aan de array
            this._data.push(userFinal);

            // Roep de callback aan het einde van de operatie
            // met het toegevoegde item als argument, of null als er een fout is opgetreden
            callback(null, userFinal);
        }, this._delayTime)
    },

    getAll(callback) {
        // Simuleer een asynchrone operatie
        setTimeout(() => {
            // Roep de callback aan, en retourneer de data
            callback(null, this._data);
        }, this._delayTime)
    },

    getById(id, callback) {
        // Simuleer een asynchrone operatie
        setTimeout(() => {
            const index =this.getIndexOfId(id);
            if (index !== -1) {
                callback(null, this._data[index]);
            } else {
                callback({status: 404, message: `Error: id ${id} does not exist!` }, null)
            }
        }, this._delayTime)
    },

    updateById(id, user, callback) {
        setTimeout(() => {
            const index = this.getIndexOfId(id);
            if (!(this.isEmailAvailable(user.emailAdress))) {
                callback({status: 400, message: `Error: emailAddress ${user.emailAdress} is already in use`})
            }
            if (!(index === -1)) {
                this._data[index] = user;
                callback(null, {user});
            } else {
                callback({status: 404, message: `Error: id ${id} does not exist!` }, null)
            }
        }, this._delayTime)
    },

    deleteById(id, callback) {
        setTimeout(() => {
            const index = this.getIndexOfId(id);
            if (!(index === -1)) {
                this._data.splice(id, 1);
                callback(null, {});
            } else {
                callback({status: 404, message: `Error: id ${id} does not exist!` }, null)
            }
        }, this._delayTime)
    },

    isEmailAvailable(email) {
        for (const user of this._data) {
            if (user.emailAdress === email) {
                return false}
        }
        return true;
    },

    // gets the index of an id. Returns -1 if the id is not found. It can also be used to check if there is a user with the ID (because if there is not it will return -1)
    getIndexOfId(id) {
        for (let i = 0; i < this._data.length; i++) {
            if (this._data[i].id === parseInt(id)) {
                return i;
            }
        }
        return -1;
    }
}

module.exports = database
// module.exports = database.index;
