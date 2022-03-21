FROM node:16.14-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY ["package.json", "package-lock.json", "./"]
RUN npm ci --production
COPY . .
CMD [ "node", "src/app.js" ]
