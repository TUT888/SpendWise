FROM node:18

# Path to the app
WORKDIR /app

# Copy package files and install inside Docker
COPY package*.json ./
RUN npm install

# Then copy the rest
COPY . .

# Expose the port
EXPOSE 3031

CMD ["node", "server.js"]