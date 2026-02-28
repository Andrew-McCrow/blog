const { Router } = require("express");
const {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} = require("../controllers/blogController");
const { verifyToken, requireAdmin } = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validate");
const {
  postCreateValidators,
  postUpdateValidators,
} = require("../middlewares/validators");

const router = Router();

router.get("/", getAllPosts);
router.get("/:id", getPostById);
router.post(
  "/",
  verifyToken,
  requireAdmin,
  postCreateValidators,
  validate,
  createPost,
);
router.put(
  "/:id",
  verifyToken,
  requireAdmin,
  postUpdateValidators,
  validate,
  updatePost,
);
router.delete("/:id", verifyToken, requireAdmin, deletePost);

module.exports = router;
