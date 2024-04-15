const mongoose = require('mongoose');

const blogschema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  body : {
    type : String,
    required : true
  },
  backcoverURL : {
    type : String,
    default : '/images/default.png'
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
const BLOG = mongoose.model('blog', blogschema);

module.exports = BLOG; 

 