FROM node:20-alpine AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY pnpm-lock.yaml package.json ./

RUN pnpm install --frozen-lockfile --prod

COPY . .

RUN pnpm build

FROM node:20-alpine

RUN apk add --no-cache dumb-init && \
    corepack enable && \
    corepack prepare pnpm@latest --activate

WORKDIR /app

COPY --from=builder /app/google-service-account.json ./google-service-account.json
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml

ENV NODE_ENV production
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

ENTRYPOINT ["dumb-init", "--"]

USER node

EXPOSE 3000

CMD ["node", "dist/src/main"]
