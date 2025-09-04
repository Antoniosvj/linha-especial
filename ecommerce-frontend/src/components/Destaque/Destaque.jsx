import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import style from './Destaque.module.css';

export const Destaque = ({ produtoDestaque }) =>{
    const url = `${import.meta.env.VITE_IMAGEM_URL}`;
  const precoFormatado = produtoDestaque.preco.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() =>{
    if(produtoDestaque.imagens && produtoDestaque.imagens.length >1){
      const interval = setInterval(() =>{
        setCurrentImageIndex(prevIndex =>
        (prevIndex +1) %produtoDestaque.imagens.length
        );
      }, 8000);

      return () => clearInterval(interval);
    }
  }, [produtoDestaque.imagens]);

  const urlCompleta = produtoDestaque.imagens && produtoDestaque.imagens.length > 0
    ? `${url}${produtoDestaque.imagens[currentImageIndex].url}`
    : '';


  return (
    <div key={produtoDestaque.id} className={style.containerCardItem}>
      <Link to={`/produto/${produtoDestaque.nome}?id=${produtoDestaque.id}`} className={style.containerImg}>
        <img src={urlCompleta} alt={produtoDestaque.nome} />
      </Link>
      <div className={style.containerDetalhes}>
        <h2>A partir de <strong>{precoFormatado}</strong></h2>
        <p>{produtoDestaque.nome}</p>
        <p className={style.Descricao}>{produtoDestaque.descricao}</p>
      </div>
    </div>
  );
}
