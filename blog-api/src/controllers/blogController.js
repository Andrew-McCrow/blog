const prisma = require("../utils/prisma");
const asyncHandler = require("../utils/asyncHandler");

const getAllPosts = asyncHandler(async (req, res) => {
  const posts = await prisma.blogPost.findMany();
  res.json(posts);
});

const getPostById = asyncHandler(async (req, res) => {
  const post = await prisma.blogPost.findUnique({
    where: { idBlog: Number(req.params.id) },
    include: { comments: true },
  });
  if (!post) return res.status(404).json({ error: "Post not found" });
  res.json(post);
});

const createPost = asyncHandler(async (req, res) => {
  const { blogTitle, blogPost, isPublished, idUser } = req.body;
  const post = await prisma.blogPost.create({
    data: { blogTitle, blogPost, isPublished: isPublished ?? false, idUser },
  });
  res.status(201).json(post);
});

const updatePost = asyncHandler(async (req, res) => {
  const { blogTitle, blogPost, isPublished } = req.body;
  const data = {};
  if (blogTitle !== undefined) data.blogTitle = blogTitle;
  if (blogPost !== undefined) data.blogPost = blogPost;
  if (isPublished !== undefined) data.isPublished = isPublished;
  const post = await prisma.blogPost.update({
    where: { idBlog: Number(req.params.id) },
    data,
  });
  res.json(post);
});

const deletePost = asyncHandler(async (req, res) => {
  await prisma.blogPost.delete({ where: { idBlog: Number(req.params.id) } });
  res.status(204).send();
});

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};
