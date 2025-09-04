import { createContext, useState, useContext } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) =>{
    const [cart, setCart] = useState([]);

    const addToCart = (produto, cor, tamanho) =>{
        //verifica se ja existe o item no carrinho
        const existingItemIndex = cart.findIndex(
            (item) =>
                item.produto.id === produto.id &&
                item.cor === cor &&
                item.tamanho === tamanho
        );

        if(existingItemIndex > -1) {
            const updatedCart = [...cart];
            updatedCart[existingItemIndex].quantidade +=1;
            setCart(updatedCart);
        } else {
            setCart((prevCart) => [
                ...prevCart,
                { produto, cor, tamanho, quantidade: 1},
            ]);
        }
    };
    const removeFromCart = (index) => {
        const updatedCart = cart.filter((_, i) => i !== index);
        setCart(updatedCart);
    };

    const clearCart = () =>{
        setCart([]);
        localStorage.removeItem(cart);
    }

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

//hook customizado para facilitar o uso
export const useCart = () => {
    return useContext(CartContext);
};