const BLOG = require('./models/blog');

const {connecttomongodb} = require('./connect');
connecttomongodb('mongodb://127.0.0.1:27017/blog-globe');

const cookieparser = require('cookie-parser');
const {checkForAuthenticationCookie} = require('./middlewares/auth');

const express = require('express');
const app = express();
const port = process.env.port || 3000;

const userrouter = require('./routes/user');
const blogrouter = require('./routes/blog');

const path = require('path');
app.set('view engine','ejs');
// app.set('views','./views');
app.set('views',path.resolve('./views'));

app.use(express.urlencoded({extended:false}));
app.use(cookieparser());
app.use(checkForAuthenticationCookie('token'));
app.use(express.static(path.resolve('./public'))); // basically express ko bta rhe hai ki public folder ka data tum use kro publicly khul ke 

app.get('/', async (req, res) => {
    const allblogs =  await BLOG.find({});
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