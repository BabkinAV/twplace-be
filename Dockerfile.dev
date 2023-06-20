FROM node:alpine

WORKDIR /app


EXPOSE 8080

# check if "node_modules" is present, install dependencies if not and run dev command afterwards 
CMD [ -d "node_modules" ] && npm run dev || npm ci && npm run build && npm run dev