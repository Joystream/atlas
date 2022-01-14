FROM node:16 as build

WORKDIR /app
COPY . .
RUN yarn --immutable
RUN yarn atlas:build

FROM nginx:stable as nginx

WORKDIR /usr/app
COPY --from=build /app/packages/atlas/dist /usr/share/nginx/html
COPY ./ci/nginx /etc/nginx/templates
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
