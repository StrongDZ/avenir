# ===== Base stage =====
FROM node:18-alpine AS base
WORKDIR /home/node/app
COPY package*.json ./

RUN npm ci

# ===== Build stage =====
FROM node:18-alpine AS build-stage
WORKDIR /home/node/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ===== Production stage =====
FROM node:18-alpine AS production-stage
WORKDIR /home/node/app

ENV NODE_ENV=production
ENV NODE_PATH=./build

# copy package.json trước để cache npm layer
COPY package*.json ./
RUN npm ci --omit=dev

# copy file build output (JS compiled) từ build stage
COPY --from=build-stage /home/node/app/build ./build
COPY --from=build-stage /home/node/app/src/swagger ./src/swagger
# copy data files cho seed script (vào đúng path mà seed script tìm: build/src/data)
# Seed script compiled sẽ tìm ở build/src/data/products.json
# (vì __dirname trong compiled code sẽ là build/src/scripts)
RUN mkdir -p ./build/src/data
COPY --from=build-stage /home/node/app/src/data/products.json ./build/src/data/products.json

# copy entrypoint script và set executable (trước khi chuyển user)
COPY docker-entrypoint.sh /home/node/app/docker-entrypoint.sh
RUN chmod +x /home/node/app/docker-entrypoint.sh

# xóa cache npm để nhẹ hơn
RUN rm -rf /root/.npm /tmp/*

# đổi user để chạy không cần root
USER node

# sử dụng entrypoint script để chạy init-db trước khi start server
ENTRYPOINT ["/home/node/app/docker-entrypoint.sh"]
