import { createContext, useState, useEffect } from "react";

export const ContextCart = createContext();

export const CartProvider = ({ children }) => {

    // cart se inicializa con lo que haya en localStorage
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // Guardar en localStorage cada vez que el carrito cambie, para setItem se necesita convertir a string
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    //Agregar producto
    function addProductToCart(product) {
        const existingProduct = cart.find(item => item._id === product._id);
        if (existingProduct) {
            setCart(cart.map(item => item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item));
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }
    }

    //Eliminar producto
    function removeProductFromCart(productId) {
        setCart(cart.filter(item => item._id !== productId));
    }

    //Aumentar cantidad
    function incrementQuantity(productId) {
        setCart(cart.map(item => item._id === productId ? { ...item, quantity: item.quantity + 1 } : item));
    }

    //Disminuir cantidad
    function decreaseQuantity(productId) {
        const product = cart.find(item => item._id === productId);
        if (product.quantity === 1) {
            removeProductFromCart(productId);
        } else {
            setCart(cart.map(item => item._id === productId ? { ...item, quantity: item.quantity - 1 } : item));
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
    function clearCart() {
        setCart([]);
    }

    return (
        <ContextCart.Provider value={{ cart, addProductToCart, removeProductFromCart, incrementQuantity, decreaseQuantity, clearCart, getCartCount, getCartMoney }}>
            {children}
        </ContextCart.Provider>
    )
}