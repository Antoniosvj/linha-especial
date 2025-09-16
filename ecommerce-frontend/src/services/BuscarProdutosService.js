import React, { useEffect, useState } from "react";
import axios from "axios";

export const BuscarProdutos = (termoDeBusca) =>{
    const [produtosEncontrados, setProdutosEncontrados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const url = `${import.meta.env.VITE_API_URL}produtos/nome`;

    useEffect(() =>{
        const fetchProdutos = async () =>{
            setLoading(true);
            setError(false);

            if(!termoDeBusca){
                setProdutosEncontrados([]);
                setLoading(false);
                return;
            }
            try{
                const response = await axios.get(`${url}?nome=${termoDeBusca}`);
                setProdutosEncontrados(response.data);
            }catch(error){
                console.error(`Erro ao buscar produtos: ${error}`);
                setError("Não foi possível carregar os produtos. Tente novamente mais tarde.");
            } finally{
                setLoading(false)
            }
        }
        fetchProdutos();
    }, [termoDeBusca]);

    return {produtosEncontrados, loading, error};
}