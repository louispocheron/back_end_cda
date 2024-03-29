// ON DEMANDE LE DOTENV
require('dotenv').config();
// LE SERVEUR EXPRESS
const express = require('express');
const app = express();
const cors = require('cors');
const fileUpload = require('express-fileupload')
const path = require('path');
const checkTokenMiddleware  = require('./token')

// ON IMPORT LES ROUTES
const authRoute = require('./routes/auth');
const imageRoute = require('./routes/imageRoute');
const commentaireRoute = require('./routes/commentaireRoute');
const likeRoute = require('./routes/like');




// MONGOOES 
const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('connecté a la base de données');
});


// parent 
// <composantFils :maProps="maValeur" @ajoutElement="addEltToArray"/>
// enfant
// emit('ajoutElement', { mesData })



app.use(cors());
// LE MIDDLEWARE DE L'API
app.use(express.json());
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
    abortOnLimit: true
}));

// PAS POUR LE LOGIN CAR ON A PAS DE TOKEN AVANT 
app.use('/api', authRoute);
app.use('/api', imageRoute);
app.use('/api', likeRoute);
app.use('/api', commentaireRoute);



app.listen('3500' , () => {
    console.log('server is running on port 3500');
});