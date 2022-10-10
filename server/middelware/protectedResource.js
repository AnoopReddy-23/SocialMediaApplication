const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

const mongoose = require('mongoose');
const UserModel = mongoose.model("UserModel");

module.exports = (req, res, next) => {
    //console.log(req.headers.authorization)
    const { authorization } = req.headers;
    //authorization -> Bearer gkjfgskgkgdgkdgsj
    if (!authorization) {
        return res.json({ result: "User not logged in" });
    }
    const token = authorization.replace("Bearer ", "");
    jwt.verify(token, JWT_SECRET, (error, payload)=>{
        if(error){
            return res.json({ result: "User not logged in" });
        }
        const {_id} = payload;
        UserModel.findById(_id)
        .then(dbUser=>{
            req.dbUser = dbUser;
            //forward the request to the next middleware or to the next route
            next();
        });
        
    });
}