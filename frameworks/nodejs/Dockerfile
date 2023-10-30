FROM node:18-alpine

WORKDIR /app

COPY index.js .

RUN npm init -y
RUN npm install mysql2

EXPOSE 80

CMD ["node", "index.js"]
