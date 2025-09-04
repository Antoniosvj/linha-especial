package com.antoniosvj.ecommerce.ecommerce_backend.repositorio;

import com.antoniosvj.ecommerce.ecommerce_backend.entidade.Produto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProdutoRepository extends JpaRepository<Produto, Long>{ //criando uma interface que herda de JpaRepository
    /* nós fornece métodos prontos
     * findAll(): Para listar todos os produtos.
     * findById(Long id): Para encontrar um produto por ID.
     * save(Produto produto): Para criar ou atualizar um produto.
     * deleteById(Long id): Para deletar um produto por ID.
     */

    List<Produto> findByNomeContainingIgnoreCase(String nome); 
    //containing para buscar a palavra que contenha
    //ignore case serva para não diferenciar maiuscula e minuscula

    List<Produto> findByCategoriaIgnoreCase(String categoria);
}
