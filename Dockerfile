FROM node:13-alpine
COPY . app/
WORKDIR app/
RUN npm ci --only-production --silent
EXPOSE 3000
CMD ["npm", "start"]