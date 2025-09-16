package com.antoniosvj.ecommerce.ecommerce_backend.controllers;

import com.antoniosvj.ecommerce.ecommerce_backend.entidade.Produto;
import com.antoniosvj.ecommerce.ecommerce_backend.entidade.Estoque;
import com.antoniosvj.ecommerce.ecommerce_backend.repositorio.ProdutoRepository;
import com.antoniosvj.ecommerce.ecommerce_backend.repositorio.EstoqueRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.HttpStatus;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.Map;

@RestController
@RequestMapping("/produtos") 
public class ProdutoController {

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private EstoqueRepository estoqueRepository; 

    @GetMapping
    public List<Produto> listarProdutos() {
        return produtoRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Produto> buscarProdutoPorId(@PathVariable Long id) {
        Optional<Produto> produto = produtoRepository.findById(id);

        if (produto.isPresent()) {
            return new ResponseEntity<>(produto.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/nome")
    public ResponseEntity<List<Produto>> buscarPorNome(@RequestParam String nome) {
        List<Produto> produtos = produtoRepository.findByNomeContainingIgnoreCase(nome);

        if (!produtos.isEmpty()) {
            return new ResponseEntity<>(produtos, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/categorias")
    public List<String> listarCategoriasUnicas(){
        List<Produto> todosOsProdutos = produtoRepository.findAll();
        Set<String> categoriasUnicas = new HashSet<>();
        for (Produto produto : todosOsProdutos){
            categoriasUnicas.add(produto.getCategoria());
        }
        return new ArrayList<>(categoriasUnicas);
    }

    @GetMapping("/categoria")
    public ResponseEntity<List<Produto>> buscarPorCategoria(@RequestParam String categoria) {
        List<Produto> produtos = produtoRepository.findByCategoriaIgnoreCase(categoria);

        if (!produtos.isEmpty()) {
            return new ResponseEntity<>(produtos, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    } 

    @PostMapping
    public ResponseEntity<Produto> criarProduto(@RequestBody Produto produto) {
        Produto novoProduto = produtoRepository.save(produto);
        return new ResponseEntity<>(novoProduto, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Produto> atualizarProduto(@PathVariable Long id, @RequestBody Produto produtoAtualizado) {
        Optional<Produto> produtoExistente = produtoRepository.findById(id);

        if (produtoExistente.isPresent()) {
            Produto produto = produtoExistente.get();
            produto.setNome(produtoAtualizado.getNome());
            produto.setDescricao(produtoAtualizado.getDescricao());
            produto.setPreco(produtoAtualizado.getPreco());
            produto.setCategoria(produtoAtualizado.getCategoria());

            Produto produtoSalvo = produtoRepository.save(produto);
            return new ResponseEntity<>(produtoSalvo, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @Transactional
@PutMapping("/finalizar-compras")
public ResponseEntity<?> finalizarCompra(@RequestBody List<Map<String, Object>> cart){
    try{
        for(Map<String, Object> item : cart){
                Long produtoId = ((Number) ((Map<String, Object>) item.get("produto")).get("id")).longValue();
            String cor = (String) item.get("cor");
            String tamanho = (String) item.get("tamanho");
            Integer quantidadeComprada = (Integer) item.get("quantidade");

            System.out.println("Produto ID: " + produtoId + ", Cor: " + cor + ", Tamanho: " + tamanho + ", Quantidade: " + quantidadeComprada);

            Optional<Produto> produtoOptional = produtoRepository.findById(produtoId);

            if(produtoOptional.isPresent()){
                Produto produto = produtoOptional.get();

                if (produto.getNome() == null) {
                    return new ResponseEntity<>("Nome do produto está nulo para o ID " + produtoId, HttpStatus.INTERNAL_SERVER_ERROR);
                }

                Optional<Estoque> estoqueOptional = produto.getEstoque().stream()
                    .filter( e -> e.getNomeCor().equals(cor) && e.getTamanho().equals(tamanho))
                    .findFirst();

                if(estoqueOptional.isPresent()){
                    Estoque estoque = estoqueOptional.get();
                    int quantidadeAtual = estoque.getQuantidade();

                    if(quantidadeAtual >= quantidadeComprada){
                        estoque.setQuantidade(quantidadeAtual - quantidadeComprada);
                        estoqueRepository.save(estoque);
                    } else{
                        return new ResponseEntity<>("Estoque insuficiente para o produto " + produto.getNome()
                            + ", cor: " + cor + ", tamanho: " + tamanho, HttpStatus.BAD_REQUEST);
                    }
                } else{
                    return new ResponseEntity<>("Estoque não encontrado para o produto " + produto.getNome() +
                            ", cor: " + cor + ", tamanho: " + tamanho, HttpStatus.NOT_FOUND);
                }
            } else{
                return new ResponseEntity<>("Produto com ID " + produtoId + " não encontrado", HttpStatus.NOT_FOUND);
            }
        }
        return new ResponseEntity<>("Compra finalizada com sucesso!", HttpStatus.OK);

    } catch(Exception e){
        System.err.println("Erro ao finalizar a compra: " + e.getMessage());
        return new ResponseEntity<>("Erro ao finalizar a compra: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

   @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarProduto(@PathVariable Long id) {
        if (produtoRepository.existsById(id)) {
            Optional<Produto> produto = produtoRepository.findById(id);
            if (produto.isPresent()) {
                estoqueRepository.deleteAll(produto.get().getEstoque());
            }
            produtoRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
