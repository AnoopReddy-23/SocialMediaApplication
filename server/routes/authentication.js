const express=require('express')
const router=express.Router()
const mongoose = require('mongoose');
const UserModel = mongoose.model("UserModel");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

const protectedResource =require('../middelware/protectedResource')

router.get('/',(req,res)=>{
    res.send("Anoop")
})

router.get('/secured',protectedResource,(req,res)=>{
    res.send("Welcome to protected route")
})

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    UserModel.findOne({ username: username })
        .then((dbUser) => {
            if (!dbUser) {//user not found
                return res.json({ result: "Invalid credentials!" });
            }
            bcrypt.compare(password, dbUser.password)
                .then((didMatch) => {
                    if (didMatch) {
                        // res.status(200).json({ result: "User Logged In successfully" });
                        // create and send a token
                        const jwtToken = jwt.sign({ _id: dbUser._id }, JWT_SECRET);
                        const { _id, username, email,city,profileImg, followers, following } = dbUser;
                        res.json({ result:"Login successful", token: jwtToken, userInfo: { _id, username, email,city,profileImg, followers, following  } });
                    } else {
                        return res.json({ result: "Invalid credentials!" });
                    }
                });
        })
        .catch((error) => {
            console.log(error);
        });
});

router.post('/register',(req,res)=>{
    //console.log(req.body)
    const { username, password, email, city, profileImg } = req.body;
    //console.log( username, password, email, city, profileImg)
    UserModel.findOne({ username: username })
        .then((dbUser) => {
            if (dbUser) {
                return res.json({ result: "User with email already exist." });
            }
            bcrypt.hash(password, 16)
                .then((hashedPassword) => {
                    const user = new UserModel({ username, password: hashedPassword, email, city, profileImg});
                    user.save()
                        .then((u) => {
                            //console.log(u)
                            res.json({ result: "User Registered successfully" });
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                });

        })
        .catch((error) => {
            console.log(error);
        });
})

module.exports=router;