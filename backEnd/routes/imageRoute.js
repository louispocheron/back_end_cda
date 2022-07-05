const router = require('express').Router();
const mongoose = require('mongoose');
const images = require('../model/images');
const user = require('../model/user');
// const multer = require('multer');
const path = require('path');
const fs = require("fs");
const checkTokenMiddleware  = require('../token')




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



router.post('/images', checkTokenMiddleware,  async (req, res) => {
    fs.appendFileSync('./public/images/' + req.files.file.name, req.files.file.data, (err) => {
        if(err){
            console.log(err);
        }
    });
    console.log(req.user);
    const newImage = await new images({
            name: req.files.file.name,
            user: mongoose.Types.ObjectId(req.user.id)
            // user: req.body.user
        });
    const updateUser = await user.findByIdAndUpdate(req.user.id, {
        $push: {
            images: newImage.id
        }
    });
        try {
            const savedImage = await newImage.save();
            const savedUser = await updateUser.save();
            res.send(savedImage);
            }
            catch (err) {
                console.log(err);
                res.status(400).send(err);
            }
});

router.get('images/user/:id', async (req, res) => {
    console.log('salut bg');
    const userImages = await images.find({user: req.params.id});
    res.send(userImages);
});




// get all images from one given user
// router.get('/images/user/:id', async (req, res) => {
//     // console.log("areazfrez")
//     console.log(req.params.id);
//     try {
//         // FF GO NEXT
//         const imageUser = await user.findById(req.params._id).populate('images');
//         console.log(imageUser.images);
//         res.send(imageUser);
//     }
//     catch (err) {
//         console.log(err);
//         res.status(400).send(err);
//     }
// });

// router.ger('/image/user/:id', async (req, res) => {
//     try {
//         const imageUser = await images.);
//         res.send(imageUser);
//     }
//     catch (err) {
//         console.log(err);
//         res.status(400).send(err);
//     }
// });


// CHOPER TOUTES LES IMAGES
router.get('/images', async (req, res) => {
    try {
        const AllImageUser = await images.find().populate('user');
        res.send(AllImageUser);
    }
    catch (err) {
        res.status(400).send(err);
    }
});

// CHOPER LES DONNEES D'UNE IMAGE
router.get('/images/:id', async (req, res) => {
    try {
        const oneImage = await images.findById(req.params.id);
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
        const type = path.extname(oneImage.name);
        res.contentType(type);  
        res.send(image);
    }
    catch (err) {
        res.status(400).send(err);
    }
})

// CHOPE TOUTES LES IMAGES
router.get('/srcImage', async(req, res)=>{
    try {
        const oneImage = await images.find();
        console.log(oneImage);
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

