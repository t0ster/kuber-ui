FROM node:slim AS stage-1
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
WORKDIR /app
RUN npm install

COPY . /app
RUN npm run build

FROM nginx:alpine
COPY --from=stage-1 /app/build /usr/share/nginx/html
COPY /nginx.conf /etc/nginx/conf.d/default.conf
