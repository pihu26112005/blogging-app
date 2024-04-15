// const {creatTokenforUser,validateToken} = require('../services/auth');

// const USER = require('../models/user');

// async function userSignup(req,res){
//     const {firstname,email,password} = req.body;
//     const user = await USER.create({firstname,email,password}); 
//     const token = creatTokenforUser(user);

//     // return res.redirect('/');
//     return res.cookie("token",token).redirect('/');
// }

// async function userSignin(req,res){
//     const {email,password} = req.body;
//    try{
//     const token = await USER.matchpasswordandGenerateToken(email,password);
//     // console.log("user",user)
//     // return res.redirect('/');
//     return res.cookie("token",token).redirect('/');
//    }
//     catch(err){
//         return res.render('signin',{ // hum aise ek object ko bhi pass kr skte hai redirect me , basically us page pe jate vaqt ye message  bhi sath jaega
//             error : "invalid email or password"
//         });
//     }
// }

// module.exports = {
//     userSignup,
//     userSignin
// } 

const { MongoClient } = require('mongodb');
const { randomBytes, createHash } = require('crypto');
const { creatTokenforUser, validateToken } = require('../services/auth');
const url = process.env.URL || 'mongodb://localhost:27017';
const client = new MongoClient(url);
const dbName = 'blog-globe';
client.connect();
const db = client.db(dbName);

const usersCollection = db.collection('users');

async function saveUser(user) {
    if(user.password){
        user.secret = randomBytes(20).toString('hex');
        user.password = createHash('sha256').update(user.password + user.secret).digest('hex');
    }
    return await usersCollection.insertOne(user);
}

async function matchpasswordandGenerateToken(email, password) {
    const user = await usersCollection.findOne({email});
    if(!user) throw new Error('user not found')

    const secret = user.secret;
    const oldhashedpassword = user.password;

    newhashedpassword = createHash('sha256').update(password + secret).digest('hex');

    if (oldhashedpassword !== newhashedpassword)
        throw new Error("incorrect password")

    const token = creatTokenforUser(user);

    return token;
}

async function userSignup(req,res){
    const {firstname,email,password} = req.body;
    const user = {firstname,email,password};
    await saveUser(user); 
    const token = creatTokenforUser(user);

    // return res.redirect('/');
    return res.cookie("token",token).redirect('/');
}

async function userSignin(req,res){
    const {email,password} = req.body;
   try{
    const token = await matchpasswordandGenerateToken(email,password);
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
