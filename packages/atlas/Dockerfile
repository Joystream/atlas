FROM node:16-alpine as build
WORKDIR /app
RUN yarn global add husky
COPY . .
RUN yarn --frozen-lockfile
RUN yarn atlas:build

FROM nginx:stable-alpine as nginx
WORKDIR /usr/app
COPY --from=build /app/packages/atlas/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

