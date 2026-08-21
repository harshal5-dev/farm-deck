# syntax=docker/dockerfile:1

ARG NODE_VERSION=22

FROM node:${NODE_VERSION}-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# The API base must be passed as a build ARG, not only a BuildKit secret:
# secret values do not participate in BuildKit's layer cache key, so a cached
# npm run build layer would keep serving a stale URL forever. ARG values do
# bust the cache. The URL is public by nature (Vite inlines it into the
# browser bundle), so its presence in builder-stage history is not a leak.
ARG VITE_API_BASE_URL=""

RUN --mount=type=secret,id=vite_env <<'EOF'
set -eu

if [ -f /run/secrets/vite_env ]; then
  # Local builds: docker build --secret id=vite_env,src=.env.production
  set -a
  . /run/secrets/vite_env
  set +a
fi

: "${VITE_API_BASE_URL:?Missing VITE_API_BASE_URL build arg}"

npm run build
EOF

FROM nginx:1.29-alpine AS runner

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:8080/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
