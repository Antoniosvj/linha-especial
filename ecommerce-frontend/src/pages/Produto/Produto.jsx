import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { produtosService } from "../../services/ProdutosService";
import { ColorSelector, SizeSelector } from "../../components";
import { useCart } from "../../contexts";
import style from './ProdutoPage.module.css';

export const ProdutoPage = () =>{
    const location = useLocation();
    const [produto, setProduto] = useState(null);
    const [tamanhoSelecionado, setTamanhoSelecionado] = useState(null);
    const [corSelecionada, setCorSelecionada] = useState(null);
    const [imagemSelecionada, setImagemSelecionada] = useState(null); // New state
    const { addToCart } = useCart();

    const url = `${import.meta.env.VITE_IMAGEM_URL}`;

    useEffect(() =>{
        const fetchProduto = async () => {
            const searchParams = new URLSearchParams(location.search);
            const queryId = searchParams.get('id');

            if(queryId){
                const data = await produtosService.getProdutoPorId(queryId);
                setProduto(data);
            }
        }
        fetchProduto();
    }, [location]);

    const onSelectTamanho = (tamanho) =>{
        setTamanhoSelecionado(tamanho);
    }

    const onSelectCor = (cor) => {
        setCorSelecionada(cor);
        // Find the image URL for the selected color
        if (produto && produto.imagens) {
            // Assuming the first image is the default, find the image URL for the selected color
            const imagem = produto.imagens.find(img => img.url.includes(cor.toLowerCase()));
            if (imagem) {
                setImagemSelecionada(imagem.url);
            } else {
                setImagemSelecionada(null); // Or a default image URL
            }
        }
    };

    const coresDisponiveis = produto?.estoque ?
        [...new Set(produto.estoque.map(item => item.nomeCor))] : [];

    const tamanhosDisponiveis = produto?.estoque ?
        [...new Set(produto.estoque.map(item => item.tamanho))] : [];

    const corHexMap = produto?.estoque ?
        produto.estoque.reduce((map, item) =>{
            map[item.nomeCor] = item.exadecimalCor;
            return map;
        }, {}) :{};

    const isCorAvailableForSelectedTamanho = (cor, selectedTamanho) => {
        if (!produto || !produto.estoque) return false;
        if (!selectedTamanho) {
            return coresDisponiveis.includes(cor);
        }
        return produto.estoque.some(item =>
            item.nomeCor === cor && item.tamanho === selectedTamanho && item.quantidade > 0
        );
    };

    const isTamanhoAvailableForSelectedCor = (tamanho, selectedCor) => {
        if (!produto || !produto.estoque) return false;
        if (!selectedCor) {
            return tamanhosDisponiveis.includes(tamanho);
        }
        return produto.estoque.some(item =>
            item.tamanho === tamanho && item.nomeCor === selectedCor && item.quantidade > 0
        );
    };

    const handleAddToCart = () =>{

        if(!tamanhoSelecionado || !corSelecionada){
            alert('Por favor, selecione uma cor e um tamanho.');
            return
        }

        addToCart(produto, corSelecionada, tamanhoSelecionado);
        alert('Produto adicionado no carrinho!')
    }

     if (!produto) {
        return <div>Carregando produto...</div>;
    }

    const imagemUrl = imagemSelecionada ? `${url}${imagemSelecionada}` : (produto.imagens && produto.imagens.length > 0 ? `${url}${produto.imagens[0].url}` : '');

    return (
        <div className={style.containerProdutoPage}>
            <section className={style.containerImg}>
                <img src={imagemUrl} alt="" />
            </section>
            <section className={style.containerProduto}>
                <div className={style.containerTitle}>
                    <h2>{produto.nome}</h2>
                    <p>A partir de <strong>{produto.preco.toFixed(2).replace('.', ',')}</strong></p>
                </div>
                <ColorSelector
                    coresDisponiveis={coresDisponiveis}
                    corHexMap={corHexMap}
                    tamanhoSelecionado={tamanhoSelecionado}
                    onSelectCor={onSelectCor}
                    isCorAvailableForSelectedTamanho={isCorAvailableForSelectedTamanho}
                    corSelecionada={corSelecionada}
                />
                    <div className={style.containerFrete}>
                        <h3>Frete Grátis | cupom: LINHA10</h3>
                    </div>
                <SizeSelector
                    tamanhosDisponiveis={tamanhosDisponiveis}
                    corSelecionada={corSelecionada}
                    onSelectTamanho={onSelectTamanho}
                    isTamanhoAvailableForSelectedCor={isTamanhoAvailableForSelectedCor}
                    tamanhoSelecionado={tamanhoSelecionado}
                />
                <div className={style.containerButton}>
                    <button onClick={handleAddToCart}>Adicionar no carrinho</button>
                </div>

            </section>
            <section className={style.containerCondicoes} >
                <div className={style.containerIconeCondicoes}>
                    <img src="/cartao-de-credito(1).png" alt="Cartão de Credito" />
                    <p><strong>5X</strong> sem juros</p>
                </div>
                <div className={style.containerIconeCondicoes}>
                    <img src="/etiqueta-de-preco.png" alt="Etiqueta de preço" />
                    <p>Preços <strong>Exclusivos</strong></p>
                </div>
                <div className={style.containerIconeCondicoes}>
                    <img src="/troca.png" alt="icone de troca" />
                    <p>Troca <strong>Grátis</strong></p>
                </div>
            </section>
            <section className={style.containerDescricao}>
                <h3>Descrição do Produto:</h3>
                <p>{produto.descricao}</p>
            </section>
        </div>
    )
}