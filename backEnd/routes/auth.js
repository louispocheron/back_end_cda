const router = require('express').Router();
const user = require('../model/user');
const bcrypt = require('bcrypt');
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

        // PERSIT LE USER DANS LA BDD
        const savedUser = await newUser.save();
        return res.status(200).json(savedUser);
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