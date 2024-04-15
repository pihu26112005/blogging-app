const { MongoClient } = require('mongodb');
const url = process.env.URL || 'mongodb://localhost:27017';
const client = new MongoClient(url);
const dbName = 'blog-globe';
client.connect();
const db = client.db(dbName);
const blogsCollection = db.collection('blogs');

const cookieparser = require('cookie-parser');
const {checkForAuthenticationCookie} = require('./middlewares/auth');

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const userrouter = require('./routes/user');
const blogrouter = require('./routes/blog');

const path = require('path');
app.set('view engine','ejs');
app.set('views',path.resolve('./views'));

app.use(express.urlencoded({extended:false}));
app.use(cookieparser());
app.use(checkForAuthenticationCookie('token'));
app.use(express.static(path.resolve('./public'))); 

app.get('/', async (req, res) => {
    const allblogs = await blogsCollection.find().toArray();
    res.render('home',{
        user: req.user,
        blogs : allblogs
    });
});

app.use('/user',userrouter);
app.use('/blog',blogrouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
