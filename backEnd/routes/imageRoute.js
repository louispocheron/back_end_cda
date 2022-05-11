const router = require('express').Router();
const images = require('../model/images');


router.post('/images', async (req, res) => {
    console.log(req.files);

    // SAVE FILE HERE
    // md5 save file
    

    const newImage = await new images({
            name: req.files.Image.name,
        });
        try {
            const savedImage = await newImage.save();
            res.send(savedImage);
            }
            catch (err) {
                console.log(err);
                res.status(400).send(err);
            }
});

// CHOPER TOUTES LES IMAGES
router.get('/images', async (req, res) => {
    try {
        const allImages = await images.find();
        res.send(allImages);
    }
    catch (err) {
        res.status(400).send(err);
    }
});

// CHOPER UNE IMAGE PAR ID
router.get('/images/:id', async (req, res) => {
    try {
        const oneImage = await image.findById(req.params.id);
        res.send(oneImage);
    }
    catch (err) {
        res.status(400).send(err);
    }
});


// DELETE UNE IMAGE
router.delete('/images/:id', async (req, res) => {
    try {
        const deletedImage = await image.findByIdAndDelete(req.params.id);
        return res.send.json(deletedImage);
    }
    catch (err) {
        res.status(400).send(err)
    }
});

// router.delete('/images/delete/all', async (req, res) => {
//     try {
//         const deletedImage = await image.findAllandDelete();
//         return res.send.json(deletedImage);
//     }
//     catch (err) {
//         res.status(400).send(err)
//     }
// });

// UPDATE UNE IMAGE
router.put('/images/:id', async (req, res) => {
    try {
        const updatedImage = await image.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            description: req.body.description,
        });
        return res.send.json(updatedImage);
    }
    catch (err) {
        res.status(400).send(err)
    }
});


module.exports = router;

