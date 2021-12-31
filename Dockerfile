FROM node:16-alpine as build
WORKDIR /app
RUN yarn global add pm2 husky
COPY . .
RUN yarn --frozen-lockfile
RUN yarn atlas:build

FROM build as pm2_start
WORKDIR /app
RUN yarn tsc -p ./tsconfig.server.json
EXPOSE 3000
CMD ["pm2-runtime", "/app/server/dist/index.js"]

FROM nginx:stable-alpine as nginx
WORKDIR /usr/app
COPY --from=build /app/dist /usr/share/nginx/html
COPY --from=build /app/nginx/default.conf /etc/nginx/conf.d/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

