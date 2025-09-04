package com.antoniosvj.ecommerce.ecommerce_backend.controllers;

import com.antoniosvj.ecommerce.ecommerce_backend.entidade.Estoque;
import com.antoniosvj.ecommerce.ecommerce_backend.entidade.Produto;
import com.antoniosvj.ecommerce.ecommerce_backend.repositorio.EstoqueRepository;
import com.antoniosvj.ecommerce.ecommerce_backend.repositorio.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*")
public class EstoqueController {

    @Autowired
    private EstoqueRepository estoqueRepository;

    @Autowired
    private ProdutoRepository produtoRepository;

    @PostMapping("/estoque")
    public ResponseEntity<Estoque> salvarEstoque(@RequestBody Estoque estoque) {
        if (estoque.getProduto() == null || estoque.getProduto().getId() == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        // Verifica se o produto associado ao estoque existe
        Optional<Produto> produto = produtoRepository.findById(estoque.getProduto().getId());

        if (produto.isPresent()) {
            Estoque novoEstoque = estoqueRepository.save(estoque);
            return new ResponseEntity<>(novoEstoque, HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/estoque/produto/{idProduto}")
    public ResponseEntity<List<Estoque>> listarEstoquePorProduto(@PathVariable Long idProduto) {
        Optional<Produto> produto = produtoRepository.findById(idProduto);

        if (produto.isPresent()) {
            return new ResponseEntity<>(produto.get().getEstoque(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}