# Usar Node.js 18 como imagen base
FROM node:18-alpine

# Instalar ngrok
RUN apk add --no-cache curl unzip && \
    curl -sSL https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.tgz | \
    tar -xz -C /usr/local/bin && \
    chmod +x /usr/local/bin/ngrok

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias (incluyendo devDependencies para compilar)
RUN npm ci

# Copiar código fuente
COPY . .

# Compilar la aplicación
RUN npm run build

# Limpiar cache pero mantener devDependencies para start:dev
RUN npm cache clean --force

# Copiar configuración de ngrok
COPY ngrok.yml /root/.config/ngrok/ngrok.yml

# Crear script de inicio
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Exponer puerto
EXPOSE 4000

# Comando de inicio
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
