// ON DEMANDE LE DOTENV
require('dotenv').config();
// LE SERVEUR EXPRESS
const express = require('express');
const app = express();

// ON IMPORT LES ROUTES
const authRoute = require('./routes/auth');
const imageRoute = require('./routes/imageRoute');
const commentaireRoute = require('./routes/commentaireRoute');



// MONGOOES 
const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('connecté a la base de données');
});


// LE MIDDLEWARE DE L'API
app.use(express.json());


app.use('/api', authRoute);
app.use('/api', imageRoute);
app.use('/api', commentaireRoute);








app.listen('3500' , () => {
    console.log('server is running on port 3500');
});