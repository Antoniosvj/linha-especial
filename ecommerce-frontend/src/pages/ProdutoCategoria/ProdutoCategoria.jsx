import { useParams } from "react-router-dom";
import { CardItem, Destaque } from "../../components";
import style from './ProdutoCategoria.module.css';
import { useProductCarousel } from "../../hooks";

export const ProdutoCategoriaPage = () =>{
    const { categoria } = useParams();
    const { produtos, produtoDestaque } = useProductCarousel(categoria);


    return (
        <div className={style.containerCategorias}>
            <div className={style.containerTitulo}>
                <h1>{categoria}</h1>    
            </div>
            <div className={style.containerProdutos}>
                <div>
                    {produtoDestaque && (
                        <Destaque key={produtoDestaque.id} produtoDestaque={produtoDestaque} />
                    )}
                </div>
                <div>
                    {produtos.map(produto =>(
                        <CardItem key={produto.id} produto={produto} />
                    )
                    )}
                </div>
            </div>
        </div>
    )
}