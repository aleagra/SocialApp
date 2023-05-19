const express = require("express");
const routerPost = express.Router();

const {
  createPost,
  getPost,
  likePost,
  comentPost,
  getAllPosts,
  friendPost,
  checkLike,
  getPostsByUserID,
} = require("../controllers/postsController");

routerPost.post("/posts/", createPost);
routerPost.get("/posts/", getAllPosts);
routerPost.get("posts/:username", getPost);
routerPost.get("/posts/friends/:userId", friendPost);
routerPost.put("/posts/:id/like", likePost);
routerPost.put("/posts/:id/comment", comentPost);
routerPost.get('/posts/:id/checkLike/:userId',checkLike);
routerPost.get("/posts/user/:userId", getPostsByUserID)

module.exports = routerPost;
