const router = require('express').Router();
const mongoose = require('mongoose');
const images = require('../model/images');
const user = require('../model/user');
// const { default: mongoose } = require('mongoose');
const commentaire = require('../model/commentaire');
const checkTokenMiddleware  = require('../token')




// POST A COMMENT ON AN IMAGE
router.post('/commentaire/:imageId', async (req, res) => {
    // console.log(req.body.user);
    const newCommentaire = await new commentaire({
        commentaire: req.body.commentaire,
        user: req.body.user,
        image: req.params.imageId
    });
    const updateImage = await images.findByIdAndUpdate(req.params.imageId, {
        $push: {
            commentaires: newCommentaire.id
        }
    });
    try {
        const savedCommentaire = await newCommentaire.save();
        const savedImage = await updateImage.save();
        console.log("bien posté !")
        res.send(savedCommentaire);
    }
    catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
});



// CHOPER UN COMMENTAIRE PAR ID
router.get('/commentaires/:id', async (req, res) => {
    try{
        const oneCommentaire = await commentaire.findById(req.params.id);
        res.send(oneCommentaire);
    }
    catch(err){
        console.log(err);
        res.status(400).send(err);
    }
});

// DELETE UN COMMENTAIRE
router.delete('/commentaire/delete/:id', async (req, res) => {
    try{
        console.log(req.params.id);
        const deletedCommentaire = await commentaire.findByIdAndDelete(req.params.id);
        return res.send(deletedCommentaire);
    }
    catch(err){
        res.status(400).send(err);
    }
});

// EDIT UN COMMENTAIRE
router.put('/commentaires/:id', async (req, res) => {
    try{
        const updatedCommentaire = await commentaire.findByIdAndUpdate(req.params.id, {
            commentaire: req.body.commentaire,
            posted_at: req.body.posted_at,
            user: req.body.user,
            image: req.body.image
        });
        return res.send.json(updatedCommentaire);
    }
    catch(err){
        console.log(err)
        res.status(400).send(err);
    }
});


// CHERCHE TOUT LES COMMENTAIRES D'UNE IMAGE DONNEE
router.get('/commentaires/image/:id', async (req, res) => {
    const coms = await commentaire.find().where('image').equals(req.params.id);

    const allUsers = coms.forEach(async (com) => {
    const users = await user.findById(com.user);
    });

    // res.write(allUsers);
    res.send(coms);

});


module.exports = router;
