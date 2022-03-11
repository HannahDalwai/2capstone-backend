const express = require('express')
const router = express.Router()
const User = require('../models/users')
const Cart = require('../models/cart')
const Product = require('../models/products')
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
  
  // ADD PRODUCT TO USER CART
  app.post(
    "/:id/cart",
    [authenticateToken, getProduct],
    async (req, res, next) => {
      const user = await User.findById(req.user._id);
  
      let product_id = res.product._id;
      let title = res.product.title;
      let category = res.product.category;
      let img = res.product.img;
      let price = res.product.price;
      let quantity = req.body.quantity;
      let created_by = req.user._id;
  
      try {
        user.cart.push({
          product_id,
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
  
  // UPDATE PRODUCT IN USER CART
  app.put(
    "/:id/cart",
    [authenticateToken, getProduct],
    async (req, res, next) => {
      const user = await User.findById(req.user._id);
      const inCart = user.cart.some((prod) => prod.product_id == req.params.id);
      console.log(inCart);
  
      if (inCart) {
        try {
          const product = user.cart.find(
            (prod) => prod.product_id == req.params.id
          );
          product.quantity = req.body.quantity;
          user.cart.quantity = product.quantity;
          user.markModified("cart");
          const updatedUser = await user.save();
          console.log(updatedUser);
          res.status(201).json(updatedUser.cart);
        } catch (error) {
          res.status(500).json(console.log(error));
        }
      }
    }
  );