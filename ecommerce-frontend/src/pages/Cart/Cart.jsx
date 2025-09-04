import { useNavigate } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import { ComprasService } from '../../services';
import { useAuth } from '../../contexts';

import style from "./CartPage.module.css"; 

export const CartPage = () => {
  const url = `${import.meta.env.VITE_IMAGEM_URL}`;
  const { isLoggedIn } = useAuth();
  const { cart, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const totalPrice = cart.reduce((total, item) => {
    return total + item.produto.preco * item.quantidade;
  }, 0);

  const handleFinalizarCompra = async () =>{
    if(isLoggedIn){
      try{
        await ComprasService.putCompra(cart);
        clearCart();
        alert('Compra finalizada com sucesso.');
      } catch(error){
        console.error("Erro ao finalizar a compra:", error);
        alert("Ocorreu um erro ao finalizar a compra. Tente novamente.");
      }
    } else {
      alert("Faça o login para finalizar a compra.")
      navigate('/login');
    }
  }

  return (
    <div className={style.containerCartPage}>
      <h2>Seu Carrinho</h2>
      {cart.length === 0 ? (
        <p>Seu carrinho está vazio.</p>
      ) : (
        <>
          <ul className={style.cartList}>
            {cart.map((item, index) => (
              <li key={index} className={style.cartItem}>
                <img
                  src={`${url}${item.produto.imagemUrl}`}
                  alt={item.produto.nome}
                  className={style.itemImage}
                />
                <div className={style.itemDetails}>
                  <h3>{item.produto.nome}</h3>
                  <p>Cor: {item.cor}</p>
                  <p>Tamanho: {item.tamanho}</p>
                  <p>Quantidade: {item.quantidade}</p>
                  <p>
                    Preço: R$
                    {(item.produto.preco * item.quantidade)
                      .toFixed(2)
                      .replace(".", ",")}
                  </p>
                  <button onClick={() => removeFromCart(index)}>Remover</button>
                </div>
              </li>
            ))}
          </ul>
          <div className={style.cartSummary}>
            <h3>Total: R${totalPrice.toFixed(2).replace(".", ",")}</h3>
            <button onClick={handleFinalizarCompra}>Finalizar Compra</button>
          </div>
        </>
      )}
    </div>
  );
};
