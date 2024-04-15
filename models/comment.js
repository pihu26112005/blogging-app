// const mongoose = require('mongoose');

// const commentschema = new mongoose.Schema({
//   content: {
//     type: String,
//     required: true
//   },
//   blogid: {
//         type : mongoose.Schema.Types.ObjectId,
//         required : true,
//         ref: 'blog'
//   },
//     createdby : {
//         type : mongoose.Schema.Types.ObjectId,
//         required : true,
//         ref: 'user'
//     },
// },
// { 
//     timestamps : true
// });


// const COMMENT = mongoose.model('comment', commentschema);

// module.exports = COMMENT; 

const { MongoClient } = require('mongodb');
const url = process.env.URL || 'mongodb://localhost:27017';
const client = new MongoClient(url);
const dbName = 'blog-globe';
client.connect();
const db = client.db(dbName);

COMMENT = db.collection('comments');
module.exports = COMMENT; 
