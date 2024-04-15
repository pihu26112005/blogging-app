const path = require('path');
const BLOG = require('../models/blog');
const COMMENT = require('../models/comment');
const multer  = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(`./public/uploads`))
    },
    filename: function (req, file, cb) {
        const filename = `${Date.now()}-${file.originalname}`
        cb(null, filename)
    }
})

const upload = multer({ storage: storage })

const express = require('express');
const router = express.Router();

router.get("/addblog",(req,res)=>{
    res.render('addblog',{
        user: req.user 
    });
});

router.post('/addblog',upload.single('coverimage'),async (req,res)=>{
    console.log(req.user);
    const blog = await BLOG.create({
        title : req.body.title,
        body : req.body.body,
        backcoverURL : `/uploads/${req.file.filename}`,
        createdby : req.user.id
    });
    return res.redirect('/');
});

router.get('/:id',async (req,res)=>{
    const blog = await BLOG.findById(req.params.id).populate("createdby");
    // ye populate basiccaly cretedby ka use krke user ki sari info is blog object me add kr dega 
    // aur hum blog ko blog.ejs me passs kr rhe hai , toh hum vha username access kr skte hai
    const comment = await COMMENT.find({blogid : req.params.id}).populate('createdby');
    res.render('blog',{
        blog: blog,
        comment: comment,
        user: req.user
    });
});
 
router.post('/:id/comment',async (req,res)=>{
   const newcomment = await COMMENT.create({
    content : req.body.content,
    blogid : req.params.id,
    createdby : req.user.id
});
    res.redirect(`/blog/${req.params.id}`);
});

module.exports = router;