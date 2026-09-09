FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Generate Prisma Client
RUN npm run prisma:generate

# Copy app code
COPY . .

# Build Next.js
RUN npm run build

# Expose port
EXPOSE 3000

# Start app
CMD ["npm", "start"]
