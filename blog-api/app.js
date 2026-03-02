const express = require("express");
const cors = require("cors");
const userRoutes = require("./src/routes/userRoutes");
const blogRoutes = require("./src/routes/blogRoutes");
const commentRoutes = require("./src/routes/commentRoutes");
const errorHandler = require("./src/middlewares/errorHandler");

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow all origins — posts and comments are public.
      // JWT on protected routes handles security.
      callback(null, true);
    },
    credentials: true,
  }),
);

app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Blog API is running" });
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/posts", blogRoutes);
app.use("/api/comments", commentRoutes);

// Global error handler (must be last)
app.use(errorHandler);

module.exports = app;
