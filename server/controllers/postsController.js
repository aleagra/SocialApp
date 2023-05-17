const { Post } = require("../models/post.models");
const { User } = require("../models/users.models");

const createPost = async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
};

const getAllPosts = async (req, resp) => {
  try {
    const allPosts = await Post.find();
    resp.json(allPosts);
  } catch (error) {
    resp.status(500).json({ message: error.message });
  }
};

const getPost = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    const posts = await Post.find({ userId: user._id });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
};

const friendPost = async (req, res) => {
  try {
    const userId = req.params.userId; // Obtener el ID del usuario actual

    // Obtener los IDs de los usuarios seguidos, incluyendo el ID del usuario actual
    const user = await User.findById(userId); // Obtener el usuario actual
    const followedUsers = user.followers; // Obtener los IDs de los usuarios seguidos

    // Obtener todos los posteos de los usuarios seguidos
    const allPosts = await Post.find({ user: { $in: followedUsers } });

    res.status(200).json(allPosts);
  } catch (err) {
    res.status(500).json(err);
  } 
};

const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("The post has been liked");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("The post has been disliked");
    }
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
};

const checkLike = async (req, res) => {
  try {
    const { id, userId } = req.params;
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const hasLiked = post.likes.includes(userId);
    res.json(hasLiked);
  } catch (err) {
    // Manejar el error
  }
}

const comentPost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  // console.log(req.body);
  try {
    if (post) {
      await post.updateOne({ $push: { comments: req.body } });
      res.status(200);
    }
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
};

const findByPost = async (req, res) => {
  const { id } = req.params;
  Post.findById(id)
    .then((data) => {
      res.json(data);
    })
    .catch(() => {
      res.json({ message: "Id no encontrado" });
    });
};

const findUserPosts =  (req, res) => {
  const userId = req.params.userId;

  // Buscar todos los post de un usuario específico
  Post.find({ userId: userId })
    .then(posts => {
      res.json(posts);
    })
    .catch(error => {
      res.status(500).send(error);
    });
};


module.exports = {
  friendPost,
  findUserPosts,
  createPost,
  getPost,
  likePost,
  comentPost,
  getAllPosts,
  findByPost,
  checkLike,


};
