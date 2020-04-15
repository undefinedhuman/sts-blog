FROM node:13-alpine
COPY . app/
WORKDIR app/
RUN npm ci --only-production --silent
EXPOSE 5000
RUN npm run start