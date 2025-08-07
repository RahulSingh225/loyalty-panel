# Stage 1: Build the Next.js app with TypeScript
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
# Install only production dependencies for the build
RUN npm ci --only=production
# Install dev dependencies needed for the build
RUN npm install --only=dev
COPY . .
# Build the Next.js app with standalone output
RUN npm run build --standalone

# Stage 2: Create production image
FROM node:18-alpine
WORKDIR /app
# Install only production dependencies
COPY package*.json ./
RUN npm ci --only=production --ignore-scripts
# Copy only the standalone output and public assets
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
# Clean npm cache to reduce size
RUN npm cache clean --force

# Expose the default Next.js port
EXPOSE 4000

# Environment variables
ENV NODE_ENV=production
ENV PORT=4000

# Start the Next.js app
CMD ["node", "server.js"]