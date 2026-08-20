# syntax=docker/dockerfile:1

ARG NODE_VERSION=22

FROM node:${NODE_VERSION}-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN --mount=type=secret,id=vite_env \
  --mount=type=secret,id=api_base_url \
  <<'EOF'
set -eu

if [ -f /run/secrets/vite_env ]; then
  set -a
  . /run/secrets/vite_env
  set +a
else
  export VITE_API_BASE_URL="$(cat /run/secrets/api_base_url 2>/dev/null || true)"
fi

: "${VITE_API_BASE_URL:?Missing VITE_API_BASE_URL build secret}"

npm run build
EOF

FROM nginx:1.29-alpine AS runner

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:8080/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
