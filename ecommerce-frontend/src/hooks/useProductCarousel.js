import { useState, useEffect } from 'react';
import { produtosService } from '../services/ProdutosService';

export const useProductCarousel = (categoria) => {
  const [produtos, setProdutos] = useState([]);
  const [produtoDestaque, setProdutoDestaque] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        let data;
        if(categoria){
          data = await produtosService.getProdutosPorCategoria(categoria);
        }else{
          data = await produtosService.getProdutos();
        }

        setProdutos(data);
      } catch (error) {
        console.error("Error fetching produtos:", error);
      }
    };

    fetchProdutos();
  }, [categoria]);

  useEffect(() => {
    if (produtos.length > 0) {
      const reversedIndex = produtos.length - 1 - currentIndex;
      setProdutoDestaque(produtos[reversedIndex]);
    }
  }, [produtos, currentIndex]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % produtos.length);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [produtos]);

  return { produtos, produtoDestaque, currentIndex };
};

