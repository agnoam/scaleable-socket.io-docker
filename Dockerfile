FROM node:latest

WORKDIR /api

# copy configs to /app folder
COPY . .

RUN ls -a

RUN yarn
RUN yarn build

EXPOSE 3000

CMD ["node", "./dist/server.bundle.js"]