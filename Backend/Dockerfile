# Use standard Node image (Debian-based) to ensure we have build tools
FROM node:18

WORKDIR /app

# COPY ONLY package.json (Avoid copying package-lock.json to prevent Windows/Linux conflicts)
COPY package.json ./

# Install dependencies (This generates a fresh, Linux-compatible lockfile inside the container)
RUN npm install

# Copy the rest of the application
COPY . .

EXPOSE 5000

CMD ["npm", "start"]