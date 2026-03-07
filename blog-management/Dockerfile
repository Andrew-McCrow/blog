FROM node:22-alpine

WORKDIR /app

# VITE_API_URL is baked into the static bundle at build time
ARG VITE_API_URL=http://localhost:3000
ENV VITE_API_URL=$VITE_API_URL

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 5175
CMD ["npx", "vite", "preview", "--host", "0.0.0.0", "--port", "5175"]
