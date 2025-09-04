# Estágio 1: Construção da aplicação React
# Usa uma imagem do Node.js para instalar as dependências e fazer o build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

ARG VITE_API_URL
ARG VITE_IMAGEM_URL

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_IMAGEM_URL=$VITE_IMAGEM_URL
RUN npm run build


# Estágio 2: Criação da imagem final
# Usa uma imagem leve do NGINX para servir os arquivos estáticos
FROM nginx:1.25.3-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]