FROM node:16

ARG FIGMA_EMAIL
ARG FIGMA_PASSWORD
ARG FIGMA_TOKEN
ARG FIGMA_IDS
ARG DOWNLOAD_TIMEOUT

WORKDIR /app
COPY . .
RUN npm i -g figma-backup

CMD ["node", "/app/packages/atlas-figma-backup-service/index.js"]
