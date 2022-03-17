const router = require('express').Router();
const user = require('../model/user');
const bcrypt = require('bcrypt');



router.post('/user/register', async (req, res) => {

    // VALIDATION AVANT DE PERSISTER LES DONNEES
    // const validation = joi.validate(req.body, schema);
    // res.send(validation);


    // ON FAIT LE TRY ET CATCH
        //HASH LE PASSWORD
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const newUser = await new user({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
    
        });

        // PERSIT LE USER DANS LA BDD
        const savedUser = await newUser.save();
        return res.status(200).json(savedUser);
    }
    catch (err) {   
        console.log(err);
        res.status(500).send(err)
    }
});


module.exports = router;