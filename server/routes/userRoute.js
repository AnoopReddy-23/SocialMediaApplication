const express=require('express')
const router=express.Router()
const mongoose = require('mongoose');
const PostModel = mongoose.model("PostModel");
const protectedResource =require('../middelware/protectedResource')
const UserModel=mongoose.model("UserModel")

router.get('/user/:userId',protectedResource,(req,res)=>{
    UserModel.findOne({_id:req.params.userId})
    .select("-password")
    .then(user=>{
        PostModel.find({author:req.params.userId})
        .populate("author","_id username")
        .exec((error,allPosts)=>{
            if(error){
                return res.json({error:error})
            }
            return res.json({user:user,posts:allPosts})
        })
    })
    .catch(err=>{return res.json({error:"User not found"})})
})

router.put('/follow',protectedResource,(req,res)=>{
    UserModel.findByIdAndUpdate(req.body.followId,{
        $push: {followers: req.dbUser._id}
    },{
        new:true
    },(error,result)=>{
        if(error){
            return res.json({error:error})
        }
        UserModel.findByIdAndUpdate(req.dbUser._id,{
            $push: {following: req.body.followId}
        },{
            new:true
        })
        .select("-password")
        .then(result=>{
            res.json(result)
        })
        .catch(error=>{
            return res.json({error})
        })
})
})

router.put('/unfollow',protectedResource,(req,res)=>{
    UserModel.findByIdAndUpdate(req.body.unfollowId,{
        $pull: {followers: req.dbUser._id}
    },{
        new:true
    },(error,result)=>{
        if(error){
            return res.json({error:error})
        }
        UserModel.findByIdAndUpdate(req.dbUser._id,{
            $pull: {following: req.body.unfollowId}
        },{
            new:true
        })
        .select("-password")
        .then(result=>{
            res.json(result)
        })
        .catch(error=>{
            return res.json({error})
        })
})
})



module.exports=router;