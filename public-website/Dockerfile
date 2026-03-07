FROM node:22-alpine

WORKDIR /app

# VITE_ vars are baked into the static bundle at build time
ARG VITE_POSTS_URL=http://localhost:3000/api/posts
ARG VITE_COMMENTS_URL=http://localhost:3000/api/comments
ENV VITE_POSTS_URL=$VITE_POSTS_URL
ENV VITE_COMMENTS_URL=$VITE_COMMENTS_URL

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 5173
CMD ["npx", "vite", "preview", "--host", "0.0.0.0", "--port", "5173"]
