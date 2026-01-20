# =============================================================================
# Dockerfile for House Arena Backend
# =============================================================================
# Multi-stage build for optimized production image
# Stage 1: Install dependencies
# Stage 2: Create minimal production image
# =============================================================================

# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Production stage
FROM node:20-alpine AS production

# Add labels for better maintainability
LABEL maintainer="House Arena Team"
LABEL version="1.0.0"
LABEL description="House Arena Backend API - DevOps CI/CD Project"

# Create non-root user for security
# Why: Running as non-root prevents container escape vulnerabilities
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copy dependencies from builder
COPY --from=builder /app/node_modules ./node_modules

# Copy application code
COPY --chown=nodejs:nodejs . .

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 4000

# Health check for container orchestration
# Why: Enables Kubernetes to detect unhealthy containers
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:4000/api/health', (r) => r.statusCode === 200 ? process.exit(0) : process.exit(1))" || exit 1

# Start application
CMD ["node", "index.js"]
