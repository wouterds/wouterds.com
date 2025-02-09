FROM node:20-alpine AS base
WORKDIR /code

FROM base AS deps

COPY package.json package-lock.json ./
RUN npm ci

FROM deps AS prod-deps

RUN npm prune --production

FROM deps AS build

ARG COMMIT_SHA
ENV COMMIT_SHA=$COMMIT_SHA
ARG VITE_CLOUDFLARE_TURNSTILE_KEY
ENV VITE_CLOUDFLARE_TURNSTILE_KEY=$VITE_CLOUDFLARE_TURNSTILE_KEY
ARG SENTRY_AUTH_TOKEN
ENV SENTRY_AUTH_TOKEN=$SENTRY_AUTH_TOKEN

COPY . .
COPY --from=deps /code/node_modules ./node_modules
COPY --from=deps /code/package.json ./package.json

RUN npm run build

FROM base AS runtime
WORKDIR /code

RUN apk update && apk add --no-cache libc6-compat dumb-init

COPY --chown=node:node --from=build /code/build ./build
COPY --chown=node:node --from=build /code/instrument.server.mjs ./instrument.server.mjs
COPY --chown=node:node --from=prod-deps /code/package.json ./package.json
COPY --chown=node:node --from=prod-deps /code/package-lock.json ./package-lock.json
COPY --chown=node:node --from=prod-deps /code/node_modules ./node_modules

ARG COMMIT_SHA
ENV COMMIT_SHA=$COMMIT_SHA
ENV PORT=3000
ENV HOST=0.0.0.0
ENV NODE_ENV=production
ENV BUILD_DATE="`date -u +%Y-%m-%dT%H:%M:%SZ`"

USER node
EXPOSE $PORT

ENTRYPOINT ["dumb-init", "--"]
CMD npm run start
