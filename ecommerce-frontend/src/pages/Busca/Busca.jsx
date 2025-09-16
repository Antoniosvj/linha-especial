import { useSearchParams } from "react-router-dom";
import { CardItem } from "../../components";
import style from './Busca.module.css';
import { BuscarProdutos } from "../../services";

export const BuscaPage = () =>{
    const [searchParams] = useSearchParams();
    const termoBusca = searchParams.get('nome');

    const  { produtosEncontrados, loading, error } = BuscarProdutos(termoBusca);

    if(loading){
        return <p>Carregando produtos...</p>;
    }

    if(error){
        return <p>{error}</p>
    }

    if (!termoBusca || produtosEncontrados.length === 0) {
        return (
            <div className={style.containerCategorias}>
                <div className={style.containerTitulo}>
                    <h1>Nenhum produto encontrado para: "{termoBusca}"</h1>
                </div>
            </div>
        );
    }

    return (
        <div className={style.containerCategorias}>
            <div className={style.containerTitulo}>
                <h1>Resultado da busca por "{termoBusca}</h1>    
            </div>
            <div className={style.containerProdutos}>
                <div>
                    {produtosEncontrados.map(produto =>(
                        <CardItem key={produto.id} produto={produto} />
                    )
                    )}
                </div>
            </div>
        </div>
    )
}