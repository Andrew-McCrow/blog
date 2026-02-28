const prisma = require("../utils/prisma");
const asyncHandler = require("../utils/asyncHandler");

const getAllComments = asyncHandler(async (req, res) => {
  const comments = await prisma.comment.findMany();
  res.json(comments);
});

const getCommentById = asyncHandler(async (req, res) => {
  const comment = await prisma.comment.findUnique({
    where: { idComment: Number(req.params.id) },
  });
  if (!comment) return res.status(404).json({ error: "Comment not found" });
  res.json(comment);
});

const createComment = asyncHandler(async (req, res) => {
  const { commentPost, idUser, idBlog } = req.body;
  const comment = await prisma.comment.create({
    data: { commentPost, idUser, idBlog },
  });
  res.status(201).json(comment);
});

const updateComment = asyncHandler(async (req, res) => {
  const { commentPost } = req.body;
  const comment = await prisma.comment.update({
    where: { idComment: Number(req.params.id) },
    data: { commentPost },
  });
  res.json(comment);
});

const deleteComment = asyncHandler(async (req, res) => {
  await prisma.comment.delete({ where: { idComment: Number(req.params.id) } });
  res.status(204).send();
});

module.exports = {
  getAllComments,
  getCommentById,
  createComment,
  updateComment,
  deleteComment,
};
