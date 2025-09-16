# Linha Especial - E-commerce Full-Stack
## Visão Geral

Este é um projeto de e-commerce completo, desenvolvido para demonstrar habilidades em desenvolvimento full-stack. A aplicação simula uma loja de roupas com funcionalidades de gestão de produtos, autenticação de usuários, e uma interface de usuário responsiva.
## Tecnologias Utilizadas
### Backend

    Java 21

    Spring Boot 3: Para a criação da API RESTful.

    Spring Security: Para autenticação de usuários e proteção de endpoints.

    Spring Data JPA & Hibernate: Para a persistência de dados.

    PostgreSQL: Como banco de dados relacional.

    JWT (jjwt): Para a criação de tokens de autenticação.

    Flyway: Para gerenciar migrações do banco de dados.

### Frontend

    React 18

    Vite: Para o ambiente de desenvolvimento e build.

    React Router DOM: Para o roteamento da aplicação.

    Axios: Para a comunicação com a API de backend.

### Infraestrutura

    Docker & Docker Compose: Para containerizar a aplicação e gerenciar o ambiente de desenvolvimento de forma isolada.

## Funcionalidades

    * Autenticação de Usuário: Cadastro, login e edição de perfil com autenticação JWT.

    * Gestão de Produtos: CRUD completo (Criar, Ler, Atualizar) de produtos e seu estoque.

    * Busca e Filtros: Pesquisa de produtos categoria.

    * Carrinho de Compras: Simulação de um carrinho de compras.

    * Design Responsivo: A interface se adapta a diferentes tamanhos de tela (mobile, tablet, desktop).

## Como Rodar o Projeto
### Pré-requisitos

    Docker e Docker Compose instalados na máquina.

### Passos

    Clone este repositório para o seu ambiente local.

    git clone [https://github.com/Antoniosvj/linha_especial.git](https://github.com/Antoniosvj/linha_especial.git)

    Navegue até a pasta raiz do projeto no seu terminal.

    cd linha_especial

    crie um arquivo .env com o seguinte conteúdo
        VITE_API_URL=http://localhost:8080/
        VITE_IMAGEM_URL=http://localhost:8080/uploads/

        JWT_SECRET=CRIE_UMA_CHAVE_SECRETA
        POSTGRES_USER=SEU_USUARIO_POSTGRES
        POSTGRES_PASSWORD=SEU_PASSWORD_POSTGRES
        POSTGRES_DB=NOME_DO_SEU_BANCO_DE_DADOS

    Execute o seguinte comando para construir e iniciar todos os contêineres:

    docker compose up --build

    Após a conclusão, o frontend estará acessível em http://localhost:5173 e a API em http://localhost:8080.

## Endpoints da API

A API RESTful segue o padrão REST e utiliza os seguintes endpoints:
### Usuários

    POST /api/usuarios/cadastro: Cadastra um novo usuário.

    POST /api/usuarios/login: Autentica um usuário e retorna um token JWT.

    PUT /api/usuarios/{id}: Edita o nome e e-mail de um usuário.

    PUT /api/usuarios/editar_senha/{id}: Edita a senha de um usuário.

### Produtos

    GET /api/produtos: Retorna todos os produtos.

    GET /api/produtos/{id}: Retorna um produto por ID.

    GET /api/produtos/nome?nome=...: Busca produtos por nome.

    GET /api/produtos/categorias: Retorna todas as categorias únicas.

    POST /api/produtos: Cria um novo produto.

    PUT /api/produtos/{id}: Edita um produto existente.

    DELETE /api/produtos/{id}: Deleta um produto e seu estoque.
