const router = require('express').Router();
const images = require('../model/images');
const user = require('../model/user.js')
const likeModel = require('../model/liked');
const { findByIdAndUpdate } = require('../model/user.js');


// ON LIKE UNE IMAGE
router.post('/like/:imageId/', async(req, res) =>{

    const userLike = await user.findById(req.body.userId)

    const isLikable = await likeModel.find({
        user: req.body.userId,
        image: req.params.imageId
    })
    
    if(isLikable.length == 0){
        const newLike = await new likeModel({
            user: req.body.userId, 
            image: req.params.imageId
        });
        const updateImage = await images.findByIdAndUpdate(req.params.imageId, {
            $push: {
                likes: newLike.id
            }
        });
        const updateUser = await user.findByIdAndUpdate(req.body.userId, {
            $push: {
                likes: newLike.id
            }
        });
        const sendNotification = await user.findByIdAndUpdate(req.body.userImage._id, {
            $push: {
                notification: ({
                    profil_pic: userLike.profil_pic,
                    text : `${userLike.name} a aimé votre photo`,
                    image: req.params.imageId
                })
            }
        })
        try{
            const saveLike = await newLike.save();
            const savedImage = await updateImage.save();
            const saveUser = await updateUser.save();
            await sendNotification.save();
            res.send({
                type: 'created',
                like: saveLike
                });
        }
        catch(err){
            console.log(err);
            res.status(400).send(err);
        }
    }
    else{
            const likeId = await likeModel.find({user: req.body.userId, image: req.params.imageId})
            const newLikeId = likeId[0].id

            await likeModel.findByIdAndDelete(newLikeId);
            const RemoveLikeFromUser = await user.findByIdAndUpdate(req.body.userId, {
                $pull:{
                    likes: newLikeId
                }
            })
            const RemoveLikeFromImage = await images.findByIdAndUpdate(req.params.imageId, {
                $pull:{
                    likes: newLikeId
                }
            })

            await RemoveLikeFromUser.save();
            await RemoveLikeFromImage.save();

            res.send({
                 type: 'deleted',
                 like: newLikeId
                })
    }
})

// ON UNLIKE UNE PHOTO
router.post('/like/delete/:id', async(req, res) => {
    try{
        const deleteLike = await likeModel.findByIdAndDelete(req.params.id);
        return res.send(deleteLike)
    }
    catch(err){
        res.status(400).send(err);
    }
})



module.exports = router;