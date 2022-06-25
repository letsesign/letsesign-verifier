FROM node:16.14 AS builder
COPY . /usr/src/letsesign-verifier
WORKDIR /usr/src/letsesign-verifier
RUN npm install
RUN npm run build

FROM nginx
COPY --from=builder /usr/src/letsesign-verifier/build /usr/share/nginx/html
