const mongoose = require('mongoose');

const commentschema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  blogid: {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref: 'blog'
  },
    createdby : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref: 'user'
    },
},
{ 
    timestamps : true
});


const COMMENT = mongoose.model('comment', commentschema);

module.exports = COMMENT; 

 