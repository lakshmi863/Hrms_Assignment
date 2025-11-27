# 1. Use Node 22 (Matches your local setup)
FROM node:22

WORKDIR /app

# 2. Copy files
COPY package.json ./
RUN npm install
COPY . .

# 3. Build the React App (Creates the 'dist' folder)
RUN npm run build

# 4. Install a light static server to serve the files
RUN npm install -g serve

# 5. Expose port (Standard is 3000 or 5173)
EXPOSE 5173

# 6. Start the server pointing to the build folder
CMD ["serve", "-s", "dist", "-l", "5173"]