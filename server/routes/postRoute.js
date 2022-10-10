const express=require('express')
const router=express.Router()
const mongoose = require('mongoose');
const PostModel = mongoose.model("PostModel");
const protectedResource =require('../middelware/protectedResource')


router.get('/posts',protectedResource,(req,res)=>{
    PostModel.find()
    .populate("author","_id username profileImg")
    .populate("comments.commentedBy", "_id username profileImg")
        .then((dbPosts)=>{
            res.json({posts: dbPosts})
        })
        .catch((error)=>{
            res.json({error})
        })
})

router.get('/postsfromfollowing',protectedResource,(req,res)=>{
    PostModel.find({author:{$in: req.dbUser.following}})
    .populate("author","_id username profileImg")
    .populate("comments.commentedBy", "_id username profileImg")
        .then((dbPosts)=>{
            res.json({posts: dbPosts})
        })
        .catch((error)=>{
            res.json({error})
        })
})

router.get('/myposts',protectedResource,(req,res)=>{
    PostModel.find({author: req.dbUser._id})
    .populate("author","_id username profileImg")
    .populate("comments.commentedBy", "_id username profileImg")
        .then((dbPosts)=>{
            res.json({posts: dbPosts})
        })
        .catch((error)=>{
            res.json({error})
        })
})

router.post('/createpost', protectedResource, (req, res) => {
    const { title, comment, image } = req.body
    //console.log(req.dbUser);
    //res.send("Done");
    req.dbUser.password = undefined;
    const post = new PostModel({ title, comment, image, author: req.dbUser });
    post.save()
        .then((dbPost) => {
            res.json({result:"Post Created!!", post: dbPost });
        })
        .catch((error) => {
            console.log(error);
        });
});

router.put('/like',protectedResource,(req,res)=>{
    PostModel.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.dbUser._id}
    },{
        new:true
    })
    .populate("author","_id username profileImg")
    .populate("comments.commentedBy", "_id username profileImg")
    .exec((error,result)=>{
        if(error){
            return res.json({error:error})
        }
        else{
            res.json(result)
        }
    })
    
})

router.put('/unlike',protectedResource,(req,res)=>{
    PostModel.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.dbUser._id}
    },{
        new:true
    })
    .populate("author","_id username profileImg")
    .populate("comments.commentedBy", "_id username profileImg")
    .exec((error,result)=>{
        if(error){
            return res.json({error:error})
        }
        else{
            res.json(result)
        }
    })
    
})

router.put('/comment',protectedResource,(req,res)=>{

    const comment={
        commentText: req.body.commentText,
        commentedBy: req.dbUser
    }

    PostModel.findByIdAndUpdate(req.body.postId,{
        $push:{comments: comment}
    },{
        new:true
    })
    .populate("comments.commentedBy", "_id username profileImg")
    .populate("author","_id username profileImg")
    .exec((error,result)=>{
        if(error){
            return res.json({error:error})
        }
        else{
            res.json(result)
        }
    })
    
})

router.delete('/deletepost/:postId',protectedResource,(req,res)=>{
    PostModel.findOne({_id:req.params.postId})
    .populate("author","_id")
    .exec((error,post)=>{
        if(error || !post){
            return res.json({error:error})
        }
        if(post.author._id.toString()===req.dbUser._id.toString()){
            post.remove()
            .then(data=>{
                res.json({result:"Post deleted Successfully",data})
            })
            .catch(error=>console.log(error))
        }
    })
})

module.exports=router;