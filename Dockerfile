# Stage 1: Build
FROM node:20-alpine AS builder

ARG DB_HOST
ARG DB_NAME
ARG DB_PORT
ARG DB_USERNAME
ARG DB_PASSWORD

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source files
COPY . .

# Build the app
RUN npm run build

# Stage 2: Run
FROM node:20-alpine

WORKDIR /app

# Copy only built files and dependencies
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Set the command to run the app
CMD ["node", "dist/main"]

# Optional: Expose the port (change if needed)
EXPOSE 8000
