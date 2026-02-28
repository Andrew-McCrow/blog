const { Router } = require("express");
const { verifyToken, requireAdmin } = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validate");
const {
  userCreateValidators,
  userUpdateValidators,
  loginValidators,
} = require("../middlewares/validators");
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
} = require("../controllers/userController");

const router = Router();

router.get("/", verifyToken, getAllUsers);
router.get("/:id", verifyToken, getUserById);
router.post(
  "/",
  verifyToken,
  requireAdmin,
  userCreateValidators,
  validate,
  createUser,
);
router.put(
  "/:id",
  verifyToken,
  requireAdmin,
  userUpdateValidators,
  validate,
  updateUser,
);
router.delete("/:id", verifyToken, deleteUser);
router.post("/login", loginValidators, validate, loginUser);

module.exports = router;
