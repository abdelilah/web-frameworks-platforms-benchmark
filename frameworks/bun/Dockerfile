FROM oven/bun:1

WORKDIR /app

COPY index.js .

RUN bun init -y
RUN bun install mysql2

EXPOSE 80

CMD ["bun", "index.js"]
