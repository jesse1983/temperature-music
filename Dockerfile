FROM node:20.11.1
RUN npm install -g bun
RUN npm install -g @nestjs/cli
WORKDIR /app
COPY . .
RUN bun install 
RUN bun run build
EXPOSE 3000
CMD ["bun", "run", "start"]