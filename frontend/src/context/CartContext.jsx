import { createContext } from "react";
import { useState } from "react";

export const ContextCart = createContext();

export const CartProvider = () => {

    const [cart, setCart] = useState([]);

    //Agregar producto
    function addProductToCart(product){
        const existingProduct = cart.find(item => item.id === product.id);
        if (existingProduct) {
            setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }
    }

    //Eliminar producto
    function removeProductFromCart(productId){
        setCart(cart.filter(item => item.id !== productId));
    }

    //Aumentar cantidad
    function incrementQuantity(productId){
        setCart(cart.map(item => item.id === productId ? { ...item, quantity: item.quantity + 1 } : item));
    }

    //Disminuir cantidad
    function decreaseQuantity(productId){
        const product = cart.find(item => item.id === productId);
        if (product.quantity === 1) {
            removeProductFromCart(productId);  
        }else{
            setCart(cart.map(item => item.id === productId ? { ...item, quantity: item.quantity - 1 } : item));
        }
    }

    //Total de productos en el carrito
    const getCartCount = () => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    }

    //Total de $ en el carrito
    const getCartMoney = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    }

    //Limpiar carrito
    function clearCart(){
        setCart([]);
    }

    return (
        <ContextCart.Provider value={{cart, addProductToCart, removeProductFromCart, incrementQuantity, decreaseQuantity, clearCart, getCartCount, getCartMoney}}>
            <App />
        </ContextCart.Provider>
    )
}