package com.antoniosvj.ecommerce.ecommerce_backend.controllers;

import com.antoniosvj.ecommerce.ecommerce_backend.entidade.LoginResponseDTO;
import com.antoniosvj.ecommerce.ecommerce_backend.entidade.Usuario;
import com.antoniosvj.ecommerce.ecommerce_backend.repositorio.UsuarioRepository;
import com.antoniosvj.ecommerce.ecommerce_backend.servicos.TokenService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private TokenService tokenService;

    @PostMapping("/cadastro")
    public ResponseEntity<Usuario> cadastrarUsuario(@RequestBody Usuario usuario) {
        Optional<Usuario> usuarioExistente = usuarioRepository.findByEmail(usuario.getEmail());
        
        if (usuarioExistente.isPresent()) {
            return new ResponseEntity<>(HttpStatus.CONFLICT); // 409 Conflict
        }

        //criptografar senha antes de salvar
        String senhaCriptografada = passwordEncoder.encode(usuario.getSenhaHash());
        usuario.setSenhaHash(senhaCriptografada);

        Usuario novoUsuario = usuarioRepository.save(usuario);
        return new ResponseEntity<>(novoUsuario, HttpStatus.CREATED); // 201 Created
    }

    @PostMapping("/login")
    public ResponseEntity<?> fazerLogin(@RequestBody Usuario loginRequest) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(loginRequest.getEmail());

        if(usuarioOpt.isEmpty()){
            Map<String, String> erro = new HashMap<>();
            erro.put("message", "Email ou senha incorretos.");
            return new ResponseEntity<>(erro, HttpStatus.UNAUTHORIZED);
        }

        //verifica se o usuáaio tem email existente
        Usuario usuario = usuarioOpt.get();

        //compara a senha informada com a senha criptografada
        boolean senhasConferem = passwordEncoder.matches(loginRequest.getSenhaHash(), usuario.getSenhaHash());

        if (senhasConferem){
            String token = tokenService.generateToken(usuario);
            usuario.setSenhaHash(null); //evita retornar a senha no json

            LoginResponseDTO responseDTO = new LoginResponseDTO(token, usuario);
            return new ResponseEntity<>(responseDTO, HttpStatus.OK);
        } else{
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED); //401
        }
    }

    @PutMapping("/editar/{id}")
    public ResponseEntity<Usuario> editarUsuario(@PathVariable Long id, @RequestBody Usuario usuarioAtualizado) {
        Optional<Usuario> usuarioExistente = usuarioRepository.findById(id);

        if(usuarioExistente.isPresent()){
            Usuario usuario = usuarioExistente.get();

            if(usuarioAtualizado.getNome() != null){
                usuario.setNome(usuarioAtualizado.getNome());
            }
            if(usuarioAtualizado.getEmail() != null){
                usuario.setEmail(usuarioAtualizado.getEmail());
            }

            Usuario usuarioSalvo = usuarioRepository.save(usuario);
            return new ResponseEntity<>(usuarioSalvo, HttpStatus.OK);
        } else{
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/editar_senha/{id}")
    public ResponseEntity<Usuario> editarSenha(@PathVariable Long id, @RequestBody Usuario usuarioAtualizado){
        Optional<Usuario> usuarioExistente = usuarioRepository.findById(id);

        
        if(usuarioExistente.isPresent()){
            Usuario usuario = usuarioExistente.get();
            String senhaCriptografada = passwordEncoder.encode(usuarioAtualizado.getSenhaHash());
            usuario.setSenhaHash(senhaCriptografada);

            Usuario usuarioSalvo = usuarioRepository.save(usuario);
            return new ResponseEntity<>(usuarioSalvo, HttpStatus.OK);
        } else{
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}