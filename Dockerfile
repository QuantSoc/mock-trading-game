# For Ubuntu 23.10 x64 DigitalOcean Droplet (image generated by M1-Mac) and lightweight node-18 app
FROM --platform=linux/amd64 node:18-alpine
# FROM node:18-alpine

# Install node_modules in /mtg/backend first to take advantage of Docker's layering-style build process (build cache)
# This way, if we only change the backend code (and not the dependencies in package*.json) we don't have to reinstall node_modules
WORKDIR /mtg

RUN mkdir backend

COPY ./backend/package*.json ./backend/

WORKDIR /mtg/backend

RUN mkdir src

RUN npm install

# Copy backend code to image, including frontend/src/constants.js file for BACKEND_PORT = 5005
WORKDIR /mtg

COPY ./frontend/src/constants.js ./frontend/src/

COPY ./backend/src/* ./backend/src/

# Change directory to run the CMD in the /backend directory
WORKDIR /mtg/backend

# Container will listen on port 5005
EXPOSE 5005

# Start backend server on port 5005
CMD ["npm", "start"]
