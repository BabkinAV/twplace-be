FROM node:alpine

WORKDIR /app

COPY package.json /

RUN npm install

COPY . .

RUN npm run build

EXPOSE 8080

# check if "node_modules" is present, install dependencies if not and run dev command afterwards 
CMD ["npm", "run", "prod" ]