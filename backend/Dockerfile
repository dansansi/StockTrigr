FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

RUN npm ci

COPY . .

RUN npm run build
RUN ls dist
RUN npx prisma generate

FROM node:22-alpine AS production

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY package*.json ./

ENV NODE_ENV=production

EXPOSE ${PORT}

CMD ["sh", "-c", "echo DATABASE_URL=$DATABASE_URL && npx prisma migrate deploy && node dist/src/main"]