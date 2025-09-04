package com.antoniosvj.ecommerce.ecommerce_backend.repositorio;

import com.antoniosvj.ecommerce.ecommerce_backend.entidade.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    
    // Este método é essencial para o login
    Optional<Usuario> findByEmail(String email);
}