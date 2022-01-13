FROM node:16-alpine
WORKDIR /app
COPY . .
RUN yarn --frozen-lockfile
RUN yarn tsc -p ./packages/atlas-meta-server/tsconfig.json
COPY ./packages/atlas-meta-server/index.html /app/packages/atlas-meta-server/dist
EXPOSE 3000
CMD ["node", "/app/packages/atlas-meta-server/dist/index.js"]
