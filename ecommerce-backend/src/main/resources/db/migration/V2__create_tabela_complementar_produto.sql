CREATE TABLE IF NOT EXISTS estoque (
    id BIGSERIAL PRIMARY KEY,
    nome_cor VARCHAR(20) NOT NULL,
    exadecimal_cor VARCHAR(7) NOT NULL,
    tamanho VARCHAR(6) NOT NULL,
    quantidade INT,
    id_produto BIGINT,
    FOREIGN KEY (id_produto) REFERENCES produtos(id)
);

CREATE TABLE imagens_produto (
    id BIGSERIAL PRIMARY KEY,
    url VARCHAR(255) NOT NULL,
    cor_nome VARCHAR(50) NOT NULL,
    produto_id BIGINT NOT NULL,
    FOREIGN KEY (produto_id) REFERENCES produtos(id)
);