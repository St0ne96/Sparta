const mongoose = require("mongoose");
const { Types: {ObjectId}} = mongoose.Schema; 
const postSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true
  } ,
  password: {
    type: Number, 
    required: true
  },
  title:{
    type: String, 
  },
  content:{
    type: String, 
  },
  createdAt: {
    type: Date, 
    default: new Date()
  }
}); 

module.exports = mongoose.model("Post", postSchema);

