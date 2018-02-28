FROM node:boron

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Bundle app source
COPY . /usr/src/app

# Install app dependencies
RUN npm install

# TODO: Can we use a variable here for this value and the one in index.js?
EXPOSE 8000 

# Start the process
CMD [ "npm", "start" ]