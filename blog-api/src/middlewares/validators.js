const { body } = require("express-validator");

const userCreateValidators = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Must be a valid email address")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
  body("isAdmin")
    .optional()
    .isBoolean()
    .withMessage("isAdmin must be a boolean"),
];

const userUpdateValidators = [
  body("email")
    .optional()
    .isEmail()
    .withMessage("Must be a valid email address")
    .normalizeEmail(),
  body("password")
    .optional()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
  body("isAdmin")
    .optional()
    .isBoolean()
    .withMessage("isAdmin must be a boolean"),
];

const loginValidators = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Must be a valid email address")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
];

const postCreateValidators = [
  body("blogTitle")
    .notEmpty()
    .withMessage("Blog title is required")
    .isLength({ max: 255 })
    .withMessage("Title must be 255 characters or fewer"),
  body("blogPost").notEmpty().withMessage("Blog post content is required"),
  body("idUser")
    .notEmpty()
    .withMessage("idUser is required")
    .isInt({ min: 1 })
    .withMessage("idUser must be a positive integer"),
  body("isPublished")
    .optional()
    .isBoolean()
    .withMessage("isPublished must be a boolean"),
];

const postUpdateValidators = [
  body("blogTitle")
    .optional()
    .isLength({ max: 255 })
    .withMessage("Title must be 255 characters or fewer"),
  body("blogPost")
    .optional()
    .notEmpty()
    .withMessage("Blog post content cannot be empty"),
  body("isPublished")
    .optional()
    .isBoolean()
    .withMessage("isPublished must be a boolean"),
];

const commentCreateValidators = [
  body("commentPost").notEmpty().withMessage("Comment content is required"),
  body("idUser")
    .notEmpty()
    .withMessage("idUser is required")
    .isInt({ min: 1 })
    .withMessage("idUser must be a positive integer"),
  body("idBlog")
    .notEmpty()
    .withMessage("idBlog is required")
    .isInt({ min: 1 })
    .withMessage("idBlog must be a positive integer"),
];

const commentUpdateValidators = [
  body("commentPost").notEmpty().withMessage("Comment content is required"),
];

module.exports = {
  userCreateValidators,
  userUpdateValidators,
  loginValidators,
  postCreateValidators,
  postUpdateValidators,
  commentCreateValidators,
  commentUpdateValidators,
};
