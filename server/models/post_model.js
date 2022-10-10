const mongoose=require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const postSchema = new mongoose.Schema({
    title:{
        type: String
    },
    comment:{
        type: String
    },
    image:{
        type: String
    },
    likes:[
        {
            type: ObjectId,
            ref:"UserModel"
        }
    ],
    comments:[
        {
            commentText: String,
            commentedBy: {
                type: ObjectId,
                ref:"UserModel"
            }
        }
    ],
    author:{
        type: ObjectId,
        ref:"UserModel"
    }
})

mongoose.model("PostModel",postSchema)