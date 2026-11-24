# Development Dockerfile for Hunger Games Arena
FROM node:20-alpine

WORKDIR /app

# Install dependencies first (leverages Docker cache layer)
COPY package*.json ./
RUN npm install

# Copy project files
COPY . .

# Expose Vite development server port
EXPOSE 3000

# Start Vite dev server with host binding
CMD ["npm", "run", "dev", "--", "--host"]
