const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./app/routes/userRoutes");
const postRoutes = require("./app/routes/postRoutes");

mongoose.connect(process.env.database, { useNewUrlParser: true}, () => {
  console.log("Connected to MongoDB")
})

const app = express();
app.set("port", process.env.PORT || 5000);
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    const _rootUrl = req.get("host") + req.url;
    res.send({
      msg: "Welcome to Blog it",
      // routes u cann navigate to
      routes: {
        users: `${_rootUrl}users`,
        posts: `${_rootUrl}posts`,
      },
    });
  });

  app.use("/users", userRoutes);
  app.use("/posts", postsRoutes);
  
  app.listen(app.get("port"), () => {
    console.log(`Server running on port ${app.get("port")}`);
  });
  