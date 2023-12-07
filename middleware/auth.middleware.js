const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");
//tester si lutilisateur est est connecte tout au long de sa navigation de site
//next apres lexuction de middleware il faut qu on continue
module.exports.checkUser = (req,res,next) =>{
    const token = req.cookies.jwt;//on utilise cookie-parser pour lire les cookies a partir des requet.cookies
    if(token){
        jwt.verify(token,process.env.TOKEN_SECRET,async (err,decodedToken) => {
            if (err){
                res.locals.user=null;
                res.cookie('jwt','',{maxAge:1});//suuprimer le cookie
                next();
            }else{
                //console.log('decoded token '+ decodedToken.id);
                let user = await  UserModel.findById(decodedToken.id);
                res.locals.user=user;
                //console.log(res.locals.user);
                next();
            }
        })
    } else {
        res.locals.use=null;
        next();
    }

}
module.exports.requireAuth= (req,res,next) =>{
    const  token = req.cookies.jwt;
    if (token)
    {
        jwt.verify(token,process.env.TOKEN_SECRET,async (err,decodedToken) =>{
            if(err){
                console.log(err);
            }else{
                console.log(decodedToken.id);
                next();//plus important !!!!!!!!!!!!!
            }
        })
    }else{
        console.log('No toekn');
    }

}