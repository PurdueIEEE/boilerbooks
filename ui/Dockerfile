FROM node:16.14-alpine as build
ENV NODE_ENV=production
WORKDIR /app
COPY ["package.json", "package-lock.json", "./"]
RUN npm ci --include=dev
COPY . .
RUN npm run build

FROM nginx:1.21.6-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY ieee-money-prod.conf /etc/nginx/nginx.conf
