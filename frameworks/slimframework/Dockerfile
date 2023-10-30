FROM php:8.1-fpm-alpine

WORKDIR /app

# Install system dependencies
RUN apk update && apk add --no-cache curl sed

# Install mysql extension
RUN docker-php-ext-install pdo pdo_mysql

# Download composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Create slimframework app
RUN composer create-project slim/slim-skeleton .


# Copy the web.php file
COPY routes.php app/routes.php

EXPOSE 80

CMD ["php", "-S", "0.0.0.0:80", "/app/public/index.php"]

