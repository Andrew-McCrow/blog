const { Router } = require("express");
const {
  getAllComments,
  getCommentById,
  createComment,
  updateComment,
  deleteComment,
} = require("../controllers/commentController");
const validate = require("../middlewares/validate");
const {
  commentCreateValidators,
  commentUpdateValidators,
} = require("../middlewares/validators");

const router = Router();

router.get("/", getAllComments);
router.get("/:id", getCommentById);
router.post("/", commentCreateValidators, validate, createComment);
router.put("/:id", commentUpdateValidators, validate, updateComment);
router.delete("/:id", deleteComment);

module.exports = router;
