const router = require('express').Router();
const images = require('../model/images');
const likeModel = require('../model/liked');


// ON LIKE UNE IMAGE
router.post('/like/:imageId', async(req, res) =>{
    const newLike = await new likeModel({
        // user: req.body.user,
        image: req.params.imageId
    });

    const updateImage = await images.findByIdAndUpdate(req.params.imageId, {
        $push: {
            likes: newLike.id
        }
    });
    try{
        const saveLike = await newLike.save();
        const savedImage = updateImage.save();
        console.log("bien liké!");
        res.send(saveLike);
    }
    catch(err){
        console.log(err);
        res.status(400).send(err);
    }
})


module.exports = router;