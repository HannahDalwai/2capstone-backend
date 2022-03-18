const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  post_id: {
    type: String,
  },
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: false,
    default: "https://picsum.photos/1920",
  },
  date: {
    type: Date,
    required: true,
    default:Date.now
  },
  created_by: {
    type: String,
    required: true,
  },
  comments: {
    type: Array,
    required: false,
    default: [],
  },
});

module.exports = mongoose.model("Post", postSchema);