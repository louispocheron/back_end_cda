const router = require('express').Router();
const user = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { route } = require('express/lib/application');



router.post('/user/register', async (req, res) => {
    console.log(req.body);
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const newUser = await new user({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
    
        });

        // check if user already exist
        const userExist = await user.findOne({ email: req.body.email });
        const nameExist = await user.findOne({ name: req.body.name });
        if (userExist) {
            return res.status(400).json({
                    error: 'un utilisateur utilise deja cette adresse email'
            });
        }
        if (nameExist) {
            return res.status(400).json({
                    error: 'un utilisateur utilise deja ce nom'
            });
        }


        // PERSIT LE USER DANS LA BDD
        const savedUser = await newUser.save();
        return res.status(200).json({
            message: 'utilisateur enregistré avec succes',
            user: savedUser
        }); 
    }
    catch (err) {   
        console.log(err);
        res.status(500).send(err)
    }
});

router.delete('/user/delete/:id', async (req, res) => {
    try {
        const deletedUser = await user.findByIdAndDelete(req.params.id);
        return res.status(200).json(deletedUser);
    }
    catch (err) {
        console.log(err);
        res.status(500).send(err)
    }
});


// GET ALL USERS
router.get('/users', async(req, res) => {
    try {
        const allUsers = await user.find();
        return res.status(200).json(allUsers);
    }
    catch (err) {
        console.log(err);
        res.status(500).send(err)
    }

});



// ON VERIFIE SI LE USER EXIST POUR LE LOGIN
router.post("/login", async (req, res) => {
    try {
        // CHECK SI L'EMAIL EXISTE
        const test = await user.findOne({ email: req.body.email });
        if (test == null) {
            return res.status(404).json({ 
                message: "L'utilisateur n'a pas été trouvé"
            });
        }

        // CHECK LE PASSWORD SI IL EST OK 
        if(!bcrypt.compareSync(req.body.password, test.password)) {
            return res.status(401).json({
                message: "Mot de passe incorrect"
            });
        }
        let token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET, { expiresIn: '1h' });
        return res.status(200).json({
            message: "Vous etes connecté",
            token: token
        });
    }
    
    catch (err) {
        console.log(err);
        res.status(500).send(err)
    }
});



router.get('/users/:id', async(req, res) => {
    try {
        const oneUser = await user.findById(req.params.id);
        return res.status(200).json(oneUser);
        }
        catch (err) {
            console.log(err);
            res.status(500).send(err)
        }
});
            


module.exports = router;