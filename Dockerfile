FROM node:slim AS stage-0
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
WORKDIR /app
RUN npm install

FROM stage-0 AS stage-test
RUN npm install --dev
COPY . /app
ENTRYPOINT ["./test.sh"]

FROM stage-0 as stage-build
COPY . /app
RUN npm run build

FROM nginx:alpine
COPY --from=stage-build /app/build /usr/share/nginx/html
COPY /nginx.conf /etc/nginx/conf.d/default.conf
