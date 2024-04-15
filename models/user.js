// const {createHash , randomBytes} = require('crypto');
// const {creatTokenforUser,validateToken} = require('../services/auth');

// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//     firstname : {
//         type : String,
//         required : true
//     },
//     email : {
//         type : String,
//         required : true,
//         unique : true
//     },
//     // to hash password
//     secret : {
//         type : String,
//         // required : true
//     },
//     password : {
//         type : String,
//         required : true
//     },
//     profileImageURL : {
//         type : String,
//         default : '/images/default.png'
//     },
//     role : {
//         type : String,
//         enum : ['admin','user'], // matlab hmara role sirf in do me se hi value le skta hai 
//         default : 'user'
//     },
// },
// { 
//     timestamps : true
// });

// // userschema.pre tab chlega jab hmare model me ek new schema bnke save hoga 
// userSchema.pre('save',function(next){
//     if(this.isModified('password')){ // yha this --> user hai , jo just abhi create hua hai jiske liye ye function v call hua hai
//         this.secret = randomBytes(20).toString('hex');
//         this.password = createHash('sha256',this.secret).update(this.password).digest('hex');
//         // createHash me hme hashing algo,secret key deni pdti hai , fir btana hota hai ki kya update krna hai , fir digest krna hota hai
//     }
//     next();
// });

// // ye schema pr ek function bnaya hai , isme phle uska naam aur baadme uski body pass krte hai 
// // ye function hum khi aur kisi schema pe call kr skte hai 
// userSchema.static("matchpasswordandGenerateToken", async function (email,password){
//     const user = await this.findOne ({email});
//     if(!user) throw new Error('user not found')

//     const secret = user.secret;
//     const oldhashedpassword = user.password;

//     const newhashedpassword = createHash('sha256',secret).update(password).digest('hex');

//     if (oldhashedpassword !== newhashedpassword)
//         throw new Error("incorrect password")

//     const token = creatTokenforUser(user);

//     return token;
// });

// const USER = mongoose.model('user', userSchema);

// module.exports = USER; 

const {creatTokenforUser,validateToken} = require('../services/auth');
const { MongoClient } = require('mongodb');
const { randomBytes, createHash } = require('crypto');
const url = process.env.URL || 'mongodb://localhost:27017';
const client = new MongoClient(url);
const dbName = 'blog-globe';
client.connect();
const db = client.db(dbName);

const USER = db.collection('users');

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

    const newhashedpassword = createHash('sha256').update(password + secret).digest('hex');

    if (oldhashedpassword !== newhashedpassword)
        throw new Error("incorrect password")

    const token = creatTokenforUser(user);

    return token;
}

module.exports = { USER, saveUser, matchpasswordandGenerateToken };
