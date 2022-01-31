FROM node:16

WORKDIR /app
COPY . .
RUN yarn --immutable
RUN yarn meta-server:build
COPY ./packages/atlas-meta-server/src/index.html /app/packages/atlas-meta-server/dist

CMD ["node", "/app/packages/atlas-meta-server/dist/index.js"]
