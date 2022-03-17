// require("dotenv").config;

const express = require("express");
const User = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getUser, getPost } = require("../middleware/get");
const authenticateToken = require("../middleware/auth");

const app = express.Router();

// GET all users
app.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// GET one user
app.get("/:id", getUser, (req, res, next) => {
  res.send(res.user);
});

// LOGIN user with email + password
app.patch("/", async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  console.log(user)
  console.log(password)
 
  if (!user) res.status(404).json({ message: "Could not find user" });
  if (await bcrypt.compare(password, user.password)) {
    try {
      const access_token = jwt.sign(
        JSON.stringify(user),
        process.env.MONGO_PASS
      );
      res.status(201).json({ jwt: access_token });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res
      .status(400)
      .json({ message: "Email and password combination do not match" });
  }
});

// REGISTER a user
app.post("/", async (req, res, next) => {
  const { fullname, email, password, phone_number } = req.body;
  console.log(req.body);
  console.log(fullname, email, password, phone_number)
  // console.log("the databse credentials"+ User.password)
  // console.log("the databse credentials"+ User.user)

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = new User({
    fullname,
    email,
    password: hashedPassword,
    phone_number,
  });

  try {
    const newUser = await user.save();
    console.log(newUser)
    try {
      const access_token = jwt.sign(
        JSON.stringify(newUser),
        process.env.MONGO_PASS
      );
      res.status(201).json({ jwt: access_token });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE a user
app.put("/:id", getUser, async (req, res, next) => {
  const { fullname, email, phone_number, password } = req.body;
  if (fullname) res.user.fullname = fullname;
  if (email) res.user.email = email;
  if (phone_number) res.user.phone_number = phone_number;
  if (password) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    res.user.password = hashedPassword;
  }

  try {
    const updatedUser = await res.user.save();
    res.status(201).send(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a user
app.delete("/:id", getUser, async (req, res, next) => {
  try {
    await res.user.remove();
    res.json({ message: "Deleted user" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET USER CART
app.get("/:id/cart", [authenticateToken, getUser], (req, res, next) => {
  try {
    res.json(req.user.cart);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// ADD post TO USER CART
app.post(
  "/:id/cart",
  [authenticateToken, getPost],
  async (req, res, next) => {
    const user = await User.findById(req.user._id);

    let post_id = res.post._id;
    let title = res.post.title;
    let category = res.post.category;
    let description = res.post.description;
    let img = res.post.img;
    let price = res.post.price;
    let quantity = req.body.quantity;
    let created_by = req.user._id;

    try {
      user.cart.push({
        post_id,
        title,
        category,
        description,
        img,
        price,
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

// UPDATE Post IN USER CART
app.put(
  "/:id/cart",
  [authenticateToken, getPost],
  async (req, res, next) => {
    const user = await User.findById(req.user._id);
    const inCart = user.cart.some((prod) => prod.post_id == req.params.id);
    console.log(inCart);

    if (inCart) {
      try {
        const post = user.cart.find(
          (prod) => prod.post_id == req.params.id
        );
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

// DELETE Post IN USER CART'
app.delete(
  "/:id/cart",
  [authenticateToken, getPost],
  async (req, res, next) => {
    res.send(res.user);
    // try {
    //   await res.user.cart.remove();
    //   res.json({ message: "Deleted Post" });
    // } catch (error) {
    //   res.status(500).json({ message: error.message });
    // }
  }
);

module.exports = app;
