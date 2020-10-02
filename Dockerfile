FROM node:slim AS stage-1
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
WORKDIR /app
RUN npm install

FROM stage-1 AS stage-2
COPY . /app
RUN npm run build

FROM nginx:alpine AS stage-3
FROM stage-3
COPY --from=stage-2 /app/build /usr/share/nginx/html
COPY /nginx.conf /etc/nginx/conf.d/default.conf
