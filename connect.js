const mongoose = require('mongoose');

async function connecttomongodb(url)
{
    mongoose.connect(url)
    .then(() => console.log('Connected to mongodb...'))
    .catch((err)=> console.error('Could not connect to mongodb...', err));
}

module.exports = { connecttomongodb };