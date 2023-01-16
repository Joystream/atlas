FROM node:16

WORKDIR /app
COPY . .
RUN yarn --immutable
RUN yarn meta-server:build

CMD ["node", "/app/packages/atlas-meta-server/dist/index.js"]
