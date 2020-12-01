const db = require("../models")
const User = db.users

let auth = (req,res,next) => {
    let token = req.cookies.auth;
    User.findByToken(token,(err,user)=>{
        if(err) throw err;
        if(!user) return res.json({
            error :true,
            message : "User belum melakukan login"
        });

        req.token= token;
        req.user=user;
        next();

    })
}

let authAdmin = (req,res,next) => {
    let token = req.cookies.auth;
    User.findByToken(token,(err,user)=>{
        if(err) throw err;
        if(!user) return res.json({
            error :true,
            message : "User belum melakukan login"
        });

        if(user.role != "admin") return res.json({
            error :true,
            message : "Tidak bisa mengakses servis Admin"
        });

        req.token= token;
        req.user=user;
        next();

    })
}

module.exports={auth, authAdmin};