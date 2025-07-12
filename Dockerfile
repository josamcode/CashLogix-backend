# 1. Use official Node.js image
FROM node:20

# 2. Set working directory
WORKDIR /app

# 3. Copy package.json and package-lock.json (if exists)
COPY package*.json ./

# 4. Install only production dependencies
RUN npm install --production

# 5. Copy the rest of the app
COPY . .

# 6. Expose the port from .env (3000)
EXPOSE 3000

# 7. Start the app
CMD ["node", "index.js"]
