FROM node:latest

WORKDIR /socket.io

# copy configs to /app folder
COPY . .

RUN ls -a

# Building dist folder
RUN yarn
RUN yarn build

# Remove all build data
RUN rm -rf ./src ./node_modules
RUN rm -rf docker-compose.yml Dockerfile
RUN rm -rf jest.config.js webpack.config.json nodemon.json
RUN rm -rf tslint.json tsconfig.json
RUN rm -rf README.md CHANGELOG.md app.json .gitignore

RUN yarn --production

EXPOSE 3000

CMD ["node", "./dist/server.js"]