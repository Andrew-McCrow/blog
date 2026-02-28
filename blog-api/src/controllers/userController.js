const prisma = require("../utils/prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany({
    select: { idUser: true, email: true, isAdmin: true },
  });
  res.json(users);
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { idUser: Number(req.params.id) },
    select: { idUser: true, email: true, isAdmin: true },
  });
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

const createUser = asyncHandler(async (req, res) => {
  const { email, password, isAdmin } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, password: hashedPassword, isAdmin: isAdmin ?? false },
    select: { idUser: true, email: true, isAdmin: true },
  });
  res.status(201).json(user);
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch)
    return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign(
    { idUser: user.idUser, isAdmin: user.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
  );

  res.json({
    token,
    user: { idUser: user.idUser, email: user.email, isAdmin: user.isAdmin },
  });
});

const updateUser = asyncHandler(async (req, res) => {
  const { email, password, isAdmin } = req.body;
  const data = {};
  if (email !== undefined) data.email = email;
  if (isAdmin !== undefined) data.isAdmin = isAdmin;
  if (password !== undefined) data.password = await bcrypt.hash(password, 10);

  const user = await prisma.user.update({
    where: { idUser: Number(req.params.id) },
    data,
    select: { idUser: true, email: true, isAdmin: true },
  });
  res.json(user);
});

const deleteUser = asyncHandler(async (req, res) => {
  await prisma.user.delete({ where: { idUser: Number(req.params.id) } });
  res.status(204).send();
});

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
};
