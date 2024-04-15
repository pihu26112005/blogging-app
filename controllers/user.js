const {creatTokenforUser,validateToken} = require('../services/auth');

const USER = require('../models/user');

async function userSignup(req,res){
    const {firstname,email,password} = req.body;
    const user = await USER.create({firstname,email,password}); 
    const token = creatTokenforUser(user);

    // return res.redirect('/');
    return res.cookie("token",token).redirect('/');
}

async function userSignin(req,res){
    const {email,password} = req.body;
   try{
    const token = await USER.matchpasswordandGenerateToken(email,password);
    // console.log("user",user)
    // return res.redirect('/');
    return res.cookie("token",token).redirect('/');
   }
    catch(err){
        return res.render('signin',{ // hum aise ek object ko bhi pass kr skte hai redirect me , basically us page pe jate vaqt ye message  bhi sath jaega
            error : "invalid email or password"
        });
    }
}

module.exports = {
    userSignup,
    userSignin
} 