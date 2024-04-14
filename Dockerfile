# Gunakan image Node.js yang ringan sebagai base image
FROM node:18.18.0

# Set working directory di dalam container
WORKDIR /app

# Copy semua file aplikasi ke dalam container
COPY . .

# Install dependencies
RUN npm install
RUN npm run build


# Expose port yang digunakan oleh aplikasi NestJS
EXPOSE 3000

# Command untuk menjalankan aplikasi ketika container dijalankan
CMD ["npm", "run", "start:prod"]
