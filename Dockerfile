FROM node:22-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 4200
EXPOSE 4203

CMD ["npm", "run", "start"]