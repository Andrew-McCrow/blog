require("dotenv").config({ path: require("path").resolve(__dirname, ".env") });
const app = require("./app");
const prisma = require("./src/utils/prisma");

const PORT = process.env.PORT || 3000;

const HOST = process.env.HOST || "localhost";
app.listen(PORT, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
