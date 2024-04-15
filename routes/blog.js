const path = require('path');
const { MongoClient , ObjectId } = require('mongodb');
const multer  = require('multer');
const url = process.env.URL || 'mongodb://localhost:27017';
const client = new MongoClient(url);
const dbName = 'blog-globe';
client.connect();
const db = client.db(dbName);

const blogsCollection = db.collection('blogs');
const commentsCollection = db.collection('comments');

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
    const blog = {
        title : req.body.title,
        body : req.body.body,
        backcoverURL : `/uploads/${req.file.filename}`,
        createdby : req.user.id
    };
    await blogsCollection.insertOne(blog);
    return res.redirect('/');
});

router.get('/:id',async (req,res)=>{
    const blog = await blogsCollection.findOne({_id: new ObjectId(req.params.id)});
    const comment = await commentsCollection.find({blogid : req.params.id}).toArray();
    res.render('blog',{
        blog: blog,
        comment: comment,
        user: req.user
    });
});

router.post('/:id/comment',async (req,res)=>{
    const newcomment = {
        content : req.body.content,
        blogid : req.params.id,
        createdby : req.user.id
    };
    await commentsCollection.insertOne(newcomment);
    res.redirect(`/blog/${req.params.id}`);
});

module.exports = router;
