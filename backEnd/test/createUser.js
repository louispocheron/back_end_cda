const mongoose = require('mongoose');
// ON CHOPE LE SCHEMA DU USER
const user = require('../model/user');
const assert = require('assert');


mongoose.Promise = global.Promise;
const MONGODB_URI = process.env.DATABASE_URL;
mongoose.connect(MONGODB_URI);
  
mongoose.connection
    .once('open', () => console.log('Connected!'))
    .on('error', (error) => {
        console.warn('Error : ', error);
    });
      
    // runs before each test
    beforeEach(() => {
        mongoose.connection.collections.users.drop(() => {
       });
});


describe("Creation d'un utilisateur dans un Document NoSql", () => {
    it("devrait créer un utilisateur", () => {
        const newUser = new user({
            name: 'test',
            email: "Unittest@gmail.com",
            password: 'test'
        });
        newUser.save()
        .then(() => {
            assert(newUser.isNew === false);
        })
        .catch((err)=> {
            console.log(err);
        });
    });
});






