# client/Dockerfile
FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# This command makes Next.js run in development mode inside Docker
# It allows for hot-reloading as you edit code
CMD ["npm", "run", "dev"]
