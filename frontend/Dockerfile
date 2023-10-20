FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
CMD ["npm", "run", "deploy"]
EXPOSE 3000