package com.antoniosvj.ecommerce.ecommerce_backend.entidade;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "estoque")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Estoque {
    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nome_cor", nullable = false, length = 20)
    private String nomeCor;

    @Column(name = "exadecimal_cor", nullable = false, length = 7)
    private String exadecimalCor;

    @Column(nullable = false, length = 6)
    private String tamanho;

    private Integer quantidade;

    //Relacionamento com a entidade
    @ManyToOne
    @JoinColumn(name = "id_produto", nullable = false)
    @JsonIgnore
    private Produto produto;

}
