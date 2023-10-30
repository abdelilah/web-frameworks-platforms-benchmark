FROM php:8.1-fpm-alpine

WORKDIR /app

# Install system dependencies
RUN apk update && apk add --no-cache curl sed

# Install mysql extension
RUN docker-php-ext-install pdo pdo_mysql

# Download composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Install laravel into /app
RUN composer create-project --prefer-dist laravel/laravel .

# Configure DB access
RUN sed -i 's/DB_CONNECTION=mysql/DB_CONNECTION=mysql/g' .env
RUN sed -i 's/DB_HOST=127.0.0.1/DB_HOST="host.docker.internal"/g' .env
RUN sed -i 's/DB_PORT=3306/DB_PORT="${MYSQL_PORT}"/g' .env
RUN sed -i 's/DB_DATABASE=laravel/DB_DATABASE="${MYSQL_DATABASE}"/g' .env
RUN sed -i 's/DB_USERNAME=root/DB_USERNAME="${MYSQL_USER}"/g' .env
RUN sed -i 's/DB_PASSWORD=/DB_PASSWORD="${MYSQL_ROOT_PASSWORD}"/g' .env

# Copy the web.php file
COPY web.php routes/web.php

EXPOSE 80

CMD ["sh", "-c", "php artisan config:cache && php artisan serve --host=0.0.0.0 --port=80"]

