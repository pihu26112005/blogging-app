const {userSignup,userSignin} = require('../controllers/user');

const express = require('express');
const router = express.Router();

router.get("/signup",(req,res)=>{
    res.render('signup');
});

router.post('/signup',userSignup);

router.get("/signin",(req,res)=>{
    res.render('signin');
});

router.post('/signin',userSignin);

router.get('/logout',(req,res)=>{
    res.clearCookie('token').redirect('/');
});
 
router.get('/in',(req,res)=>{
    res.render('signin&signup');
});

module.exports = router;
