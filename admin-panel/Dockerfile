# Stage 1: Build the Next.js app with TypeScript
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Build the Next.js app, which compiles TypeScript
RUN npm run build

# Stage 2: Create production image
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/tsconfig.json ./

# Expose the default Next.js port
EXPOSE 4000

# Environment variables
ENV NODE_ENV=production
ENV PORT=4000

# Start the Next.js app
CMD ["npm", "start"]