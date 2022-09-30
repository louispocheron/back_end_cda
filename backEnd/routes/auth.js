const router = require('express').Router();
const UserModel = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { route } = require('express/lib/application');
const fs = require('fs')

router.post('/user/register', async (req, res) => {
    const img = fs.readFileSync('./public/profilPic/default_avatar.jpg')
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const newUser = await new UserModel({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            profil_picture: fs.appendFileSync('./public/profilPic/default_avatar.jpg', img, (err) =>{
                if(err){
                    console.log(err)
                }
            })
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
        let token = jwt.sign({ id: savedUser._id.toString() }, process.env.TOKEN_SECRET, { expiresIn: '1h' });
        return res.status(200).json({
            message: 'utilisateur enregistré avec succes',
            user: savedUser,
            token: token
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


// DONNEES D'UN USER 
router.get('/user/data/:id', async(req, res) => {
    try {
        const oneUser = await UserModel.findById(req.params.id).populate('likes');
        res.send(oneUser);
        }
        catch (err) {
            console.log(err);
            res.status(500).send(err)
        }
});

// follow a user
router.post('/follow/:id', async(req, res) => {
    const currentUser = await UserModel.findById(req.body.user);

  function isAlreadyFollowing(){
    return currentUser.following.find(el => el === req.params.id)
  }
  

    if (isAlreadyFollowing() == undefined){
        const updateFollowedUser = await UserModel.findByIdAndUpdate(req.params.id, {
            $push: {
                followers: req.body.user
            },
        })
        const updateFollowingUser = await UserModel.findByIdAndUpdate(req.body.user, {
            $push: {
                following: req.params.id
            }
        })
        try{
            await updateFollowedUser.save();
            await updateFollowingUser.save();
            res.send('created')
        }
        catch(err){
            console.log(err)
            console.log('une erreur est survenu')
        }
    } else {
        
        try{
            const removeFollowing = await UserModel.findByIdAndUpdate(req.body.user, {
                $pull: {
                    following: req.params.id
                }
            })
            const removeFollower = await UserModel.findByIdAndUpdate(req.params.id, {
                $pull: {
                    followers: req.body.user
                }
            })
            await removeFollower.save();
            await removeFollowing.save();
            res.send('deleted');
        }
        catch(err){
            console.log(err);
        }
    }
})


// NOTIFICATION ROUTES BELOW
router.post('/notification/delete/:id', async(req, res) => {
    const RemoveNotification = await UserModel.findByIdAndUpdate(req.params.id, {
        $set: {
            notification: []
        }
    })
    try{
        await RemoveNotification.save();
        res.send('notifications supprimé');
    }
    catch(error){
        console.log(error);
    }
})


module.exports = router;