const mongoose=require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const userSchema = new mongoose.Schema({
    username:{
        type: String
    },
    password:{
        type: String
    },
    email:{
        type: String
    },
    city:{
        type: String
    },
    profileImg:{
        type: String,
        default: "https://res.cloudinary.com/anoop23/image/upload/v1665381608/SociaMediaApp/ProfilePics/human-profile-picture-black-vector-260nw-239192701_rchnar.jpg"
    },
    followers:[
        {
            type: ObjectId,
            ref:"UserModel"
        }
    ],
    following: [
        {
            type: ObjectId,
            ref:"UserModel"
        }
    ]
})

mongoose.model("UserModel",userSchema)