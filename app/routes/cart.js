const express = require('express')
const router = express.Router()
const User = require('../models/users')
const Cart = require('../models/cart')
const Post = require('../models/posts')
const authenticaToken =require("../middleware/authJwt")
const getPost =require("../middleware/verifySignup")



// GET USER CART
app.get("/:id/cart", [authenticateToken, getUser], (req, res, next) => {
    try {
      res.json(req.user.cart);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  });
  
  // ADD Post TO USER  favourites
  app.post(
    "/:id/cart",
    [authenticateToken, getPost],
    async (req, res, next) => {
      const user = await User.findById(req.user._id);
  
      let post_id = res.post._id;
      let title = res.post.title;
      let category = res.post.category;
      let img = res.post.img;
      let price = res.post.price;
      let quantity = req.body.quantity;
      let created_by = req.user._id;
  
      try {
        user.cart.push({
          post_id,
          title,
          category,
          price,
          img,
          quantity,
          created_by,
        });
        const updatedUser = await user.save();
        res.status(201).json(updatedUser);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    }
  );