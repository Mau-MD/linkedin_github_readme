FROM node:16-alpine 

WORKDIR /app

COPY . .

# Install backend dependencies
RUN yarn install

# Install frontend dependencies
RUN yarn --cwd ./frontend install

# Build frontend
RUN yarn --cwd ./frontend build

# Install ts-node
RUN yarn global add ts-node

EXPOSE 8080
CMD ["cross-env", "DOCKER=true", "ts-node", "index.ts"]