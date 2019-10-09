const mongoose= require("mongoose");
const blogSchema= new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  body: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
    unique: true,
  },
  created_by: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  permisions: [String]
});

const Blog = mongoose.model("Blog", blogSchema);




exports.Blog =Blog;


