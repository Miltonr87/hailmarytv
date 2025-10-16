# Dockerfile
FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
COPY . .

RUN npm ci
RUN npm run build

CMD ["npm", "run", "preview"]