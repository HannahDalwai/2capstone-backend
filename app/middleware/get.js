const User = require("../models/users");
const Post = require("../models/posts");

async function getUser(req, res, next) {
  let user;
  try {
    user = await User.findById(req.params.id);

    if (user == null) {
      return res.status(404).json({ message: "Cannot find user" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  res.user = user;
  next();
}

async function getPost(req, res, next) {
  let post;
  try {
    post = await Post.findById(req.params.id);

    if (post == null) {
      return res.status(404).json({ message: "Cannot find post" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  res.post= post;
  next();
}

module.exports = { getUser, getPost };