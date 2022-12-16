const mongoose = require("mongoose");
const { Types: {ObjectId}} = mongoose.Schema; 
const commentSchema = new mongoose.Schema({
  author: {
    type: ObjectId,
    required: true,
    ref: "Post"
  } ,

  comment:{
    type: String,
    required: true, 
  },
  created_at: {
    type: Date, 
    default: new Date()
  }
}); 

module.exports = mongoose.model("Comment", commentSchema);


