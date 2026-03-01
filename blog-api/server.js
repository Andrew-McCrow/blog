require("dotenv").config({ path: require("path").resolve(__dirname, ".env") });
const app = require("./app");
const prisma = require("./src/utils/prisma");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:3000`);
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
