FROM node:16-bullseye-slim
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
# NOTE: Required to build @prisma/client
COPY prisma ./prisma/
RUN yarn install
COPY . .
RUN yarn build
ENV NODE_ENV production
EXPOSE 4000
CMD yarn migrations:deploy && yarn start
