import axios from "axios";

const url = `${import.meta.env.VITE_API_URL}/produtos`;


const putCompra = async (cart) => {
  try {
    const response = await axios.put(`${url}/finalizar-compras`, cart);
    if (response.status !== 200) {
      throw new Error("Falha ao finalizar compra");
    }
  } catch (error) {
    console.error(`Erro ao finalizar a compra: ${error}`);
  }
};

export const ComprasService = {
    putCompra
}