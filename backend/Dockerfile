# Bagian dari docker file yang akan digunakan untuk membangun project golang menjadi executable

#Perintah untuk menentukan versi golang yang akan digunakan untuk membangun project
FROM golang:1.26.2-alpine AS builder

#Directory root dari golang akan diberi alias /app
WORKDIR /app

#Mengintsall git package untuk alpine-linux untuk mengurangi ukuran file image
RUN apk add --no-cache git

#Menjiplak file go.mod serta go.mod menuju direktori dasar container untuk menjadi katalog library golang yang digunakan
COPY go.mod go.sum ./
#Mendownload semua library yang digunakan oleh projek golang
RUN go mod download

#Menjiplak semua file pada directori projek menuju direktori container
COPY . .

# Menjalankan comamnd untuk menginstall go swagger dan menjalankan swag init untuk inisialisasi swaggo pada container
RUN go install github.com/swaggo/swag/cmd/swag@latest && swag init

# Membaangun projek golang menjadi file executible pada folder "server" pada direktori container
RUN CGO_ENABLED=0 GOOS=linux go build -o server .


# Command untuk menggunakan versi alpine linux
FROM alpine:latest

# Mendeifnisikan root working directory
WORKDIR /app

# Menambahkan sertifikasi untuk enkripsi endpoint
RUN apk --no-cache add ca-certificates

# Menjiplak hasil dari golang yang telah dibangun sebelumn ke root working directory container
COPY --from=builder /app/server .

# Menjiplak hasil dari file dokumentasi yang telah dibuat sebelumnya menuju folder dokumentasi pada file directory
COPY --from=builder /app/docs ./docs

# Mengekspose port 3000 untuk dijadikan port untuk menjalankan backend service
EXPOSE 5000

# Command yang akan dijalankan setelah container telah dibangun dan akan menjalankan file executable golang yang berada di containernya
CMD ["./server"]
