FROM php:8.1-fpm-alpine

WORKDIR /app

# Install system dependencies
RUN apk update && apk add --no-cache curl sed

# Install mysql extension
RUN docker-php-ext-install pdo pdo_mysql

# Copy the web.php file
COPY index.php .

EXPOSE 80

CMD ["php", "-S", "0.0.0.0:80", "/app/index.php"]
