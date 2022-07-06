FROM node:16

WORKDIR /app
COPY . .
RUN yarn --immutable
RUN yarn avatar-service:build

CMD ["node", "/app/packages/atlas-avatar-service/dist/index.js"]
