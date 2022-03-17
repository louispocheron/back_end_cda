const router = require('express').Router();
const commentaire = require('../model/commentaire');


// POST UN COMMENTAIRE
router.post('image/commentaires', async (req, res) => {
    const newCommentaire = new commentaire({
        commentaire: req.body.commentaire,
        posted_at: req.body.posted_at,
        user: req.body.user,
        image: req.body.image
    });
    try{
        const savedCommentaire = await newCommentaire.save();
        res.send(savedCommentaire);
    }
    catch(err){
        console.log(err);
        res.status(400).send(err);
    }
});

// TOUT LES COMMENTAIRES DE L'IMAGE
router.get('/commentaires', async (req, res) => {
    try{
        const allCommentaires = await commentaire.find();
        res.send(allCommentaires);
    }
    catch(err){
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
router.delete('/commentaires/:id', async (req, res) => {
    try{
        const deletedCommentaire = await commentaire.findByIdAndDelete(req.params.id);
        return res.send.json(deletedCommentaire);
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


module.exports = router;
