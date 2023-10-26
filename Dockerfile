FROM node:14

WORKDIR /app

COPY package.json ./

RUN npm config set "@fortawesome:registry" https://npm.fontawesome.com/

RUN npm config set "//npm.fontawesome.com/:_authToken" 45971AED-0769-4737-B974-66CE17BF5447

RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
