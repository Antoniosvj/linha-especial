package com.antoniosvj.ecommerce.ecommerce_backend.configuracao;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.Collections;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(withDefaults())
            .authorizeHttpRequests(authorize -> authorize
                // Endpoints públicos para cadastro, produtos e estoque
                .requestMatchers("/usuarios/editar_senha/**").permitAll()
                .requestMatchers("/usuarios/cadastro").permitAll()
                .requestMatchers("/usuarios/login").permitAll()
                .requestMatchers("/usuarios/editar/**").permitAll()
                .requestMatchers("/produtos").permitAll()
                .requestMatchers("/produtos/**").permitAll()
                .requestMatchers("/estoque/**").permitAll()
                // Permissão para acessar arquivos estáticos na pasta de uploads
                .requestMatchers("/uploads/**").permitAll()
                .anyRequest().authenticated()
            )
            .csrf(AbstractHttpConfigurer::disable);
        return http.build();
    }
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Permite requisições do seu frontend (ou de qualquer lugar se usar Collections.singletonList("*"))
        configuration.setAllowedOriginPatterns(Collections.singletonList("http://localhost:5173"));
        //configuration.setAllowedOriginPatterns(Collections.singletonList("*")); //usado para testar o frontend
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}