FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

# postinstall runs `prisma generate` automatically
RUN npm ci --omit=dev

COPY . .

EXPOSE 3000

# Run migrations then start the server
CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]
