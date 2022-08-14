const router = require('express').Router();
const UserModel = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { route } = require('express/lib/application');



router.post('/user/register', async (req, res) => {
    console.log(req.body);
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const newUser = await new UserModel({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
    
        });

        // check if user already exist
        const userExist = await UserModel.findOne({ email: req.body.email });
        const nameExist = await UserModel.findOne({ name: req.body.name });
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
        const deletedUser = await UserModel.findByIdAndDelete(req.params.id);
        return res.status(200).json(deletedUser);
    }
    catch (err) {
        console.log(err);
        res.status(500).send(err)
    }
});


// GET ALL IMAGE FROM A CERTAIN USER
router.get('/user/images/profil/:id', async (req, res) => {
    try {
        const userImages = await UserModel.findById(req.params.id).populate('images');
        const image = userImages.images
        return res.status(200).json(image);
    }
    catch (err) {
        console.log(err);
        res.status(500).send(err)
    }
});

// GET ALL USERS
router.get('/users', async(req, res) => {
    try {
        const allUsers = await UserModel.find();
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
        const user = await UserModel.findOne({ email: req.body.email });
        if (user == null) {
            return res.status(404).json({ 
                message: "L'utilisateur n'a pas été trouvé"
            });
        }

        // CHECK LE PASSWORD SI IL EST OK 
        if(!bcrypt.compareSync(req.body.password, user.password)) {
            return res.status(401).json({
                message: "Mot de passe incorrect"
            });
        }
        let token = jwt.sign({ id: user._id.toString() }, process.env.TOKEN_SECRET, { expiresIn: '1h' });
        return res.status(200).json({
            message: "Vous etes connecté",
            token: token,
            userId: user._id
        });
    }
        
    catch (err) {
        console.log(err);
        res.status(500).send(err)
    }
});



router.get('/user/test/:id', async(req, res) => {
    try {
        const oneUser = await UserModel.findOne({ _id: req.params.id });
        res.send(oneUser);
        }
        catch (err) {
            console.log(err);
            res.status(500).send(err)
        }
});

            


module.exports = router;