# syntax=docker/dockerfile:1

ARG GO_VERSION=1.27

FROM golang:${GO_VERSION}-alpine AS builder

WORKDIR /src

RUN apk add --no-cache ca-certificates git

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -trimpath -ldflags="-s -w" -o /bin/farm-deck-server ./cmd/api

FROM alpine:3.22 AS runner

WORKDIR /app

RUN apk add --no-cache ca-certificates tzdata \
  && addgroup -S app \
  && adduser -S app -G app

COPY --from=builder /bin/farm-deck-server /app/farm-deck-server

EXPOSE 8083

USER app

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:8083/api/v1/health || exit 1

ENTRYPOINT ["/app/farm-deck-server"]
