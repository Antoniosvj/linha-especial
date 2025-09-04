package com.antoniosvj.ecommerce.ecommerce_backend.repositorio;

import org.springframework.data.jpa.repository.JpaRepository;
import com.antoniosvj.ecommerce.ecommerce_backend.entidade.Estoque;
import org.springframework.stereotype.Repository;

@Repository
public interface EstoqueRepository extends JpaRepository<Estoque, Long>{
    
}
