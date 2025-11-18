# ================================
# Builder Stage (Alpine + Fixed LightningCSS)
# ================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files for caching
COPY package.json package-lock.json* ./

# Install ALL deps in one layer (prod + dev) with legacy peers for Tailwind v4
RUN npm ci --legacy-peer-deps

# Copy source
COPY . .

# ──────────────────────────────────────────────────────────────
# FIX for LightningCSS musl detection bug (Alpine)
# Force install the correct binary + rebuild from source
# ──────────────────────────────────────────────────────────────
RUN npm install lightningcss-linux-x64-musl
RUN npm rebuild lightningcss --build-from-source

# Build (no --standalone flag in Next.js 15+)
RUN npm run build

# ================================
# Runtime Stage (Tiny Alpine ~75MB)
# ================================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production \
    PORT=4000 \
    NEXT_TELEMETRY_DISABLED=1

EXPOSE 4000

# Prod deps only
COPY package.json package-lock.json* ./
RUN npm ci --only=production --ignore-scripts --legacy-peer-deps && \
    npm cache clean --force

# Copy standalone output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Add libc compat for any edge cases
RUN apk add --no-cache libc6-compat

CMD ["node", "server.js"]