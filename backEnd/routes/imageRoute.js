const router = require('express').Router();
const images = require('../model/images');
// const multer = require('multer');
const path = require('path');
const fs = require("fs")



// const storage = multer.diskStorage({

//     destination: (req, file, cb) => {
//         cb(null, '../public/images');
//     },
//     filename: (req, file, cb) => {
//         console.log(file);
//         cb(null, path.extname(file.originalname));
//     }
// })

// const upload = multer ({
//     storage: storage
// })



router.post('/images', async (req, res) => {
    fs.appendFileSync('./public/images/' + req.files.file.name, req.files.file.data, (err) => {
        if(err){
            console.log(err)
        }
    });
    const newImage = await new images({
            name: req.files.file.name,
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
        const oneImage = await images.findById(req.params.id);
        res.send(oneImage);
    }
    catch (err) {
        res.status(400).send(err);
    }
});

//SOURCE UNE IMAGE
router.get('/srcImage/:id', async(req, res)=>{
    try {
        const oneImage = await images.findById(req.params.id);
        let image = fs.readFileSync('./public/images/' + oneImage.name);
        res.contentType('image/jpg');
        res.send(image);
    }
    catch (err) {
        res.status(400).send(err);
    }
})


router.get('/srcImage/', async(req, res)=>{
    try {
        const oneImage = await images.find();
        let image = fs.readFileSync('./public/images/' + oneImage.name);
        res.contentType('image/jpg');
        res.send(image);
    }
    catch (err) {
        res.status(400).send(err);
    }
})


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

