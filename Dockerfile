FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./

FROM base AS development-deps
RUN npm install && npm cache clean --force

FROM base AS production-deps
RUN npm install --omit=dev && npm cache clean --force

FROM node:20-alpine AS development
WORKDIR /app
ENV NODE_ENV=development
COPY --from=development-deps /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--legacy-watch"]

FROM node:20-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
COPY --from=production-deps /app/node_modules ./node_modules
COPY src ./src
COPY drizzle ./drizzle
COPY drizzle.config.js ./
RUN addgroup -S nodejs && adduser -S nodejs -G nodejs \
    && chown -R nodejs:nodejs /app
USER nodejs
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 CMD node -e "require('http').get('http://127.0.0.1:3000/health',(res)=>{process.exit(res.statusCode===200?0:1)}).on('error',()=>process.exit(1))"
CMD ["npm", "run", "start"]
