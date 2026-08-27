FROM golang:1.26.2-alpine3.22 AS builder

WORKDIR /app

RUN apk add --no-cache git

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN go install github.com/swaggo/swag/cmd/swag@latest && swag init

RUN CGO_ENABLED=0 GOOS=linux go build -o server .

FROM alpine:3.24.1

WORKDIR /app

RUN apk --no-cache add ca-certificates

COPY --from=builder /app/server .

# COPY --from=builder /app/docs ./docs

CMD [ "./server" ]
