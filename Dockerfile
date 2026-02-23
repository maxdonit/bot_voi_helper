# Используем официальный образ Node.js
FROM node:22-slim

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файлы манифестов
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем исходный код
COPY . .

# Собираем фронтенд (Vite)
RUN npm run build

# Указываем порт приложения (теперь 7123)
ENV PORT=7123
EXPOSE 7123

# Указываем переменную окружения для продакшена
ENV NODE_ENV=production

# Запуск приложения
CMD ["npm", "start"]
