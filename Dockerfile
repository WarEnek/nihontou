FROM node:20-bullseye-slim

WORKDIR /app

COPY package*.json ./

# Установим явно необходимые пакеты
RUN npm install -g npm@latest && \
    npm install --no-optional && \
    npm install @rollup/rollup-linux-x64-gnu

COPY . .

EXPOSE 8000

RUN npm list

CMD ["npm", "run", "dev"]