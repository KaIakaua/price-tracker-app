import './StoreView.css'; 
import { useState } from 'react';


const storeData = {
    name: "Example Supermarket",
    items: [
        {
            id: 1,
            name: "Milk",
            price: 2.50,
            fullName: "Fresh Dairy Milk, 1 Litre",
            tags: ["dairy", "beverage", "milk"],
            imagePlaceholder: "🥛"
        },
        {
            id: 2,
            name: "Bread",
            price: 1.80,
            fullName: "Whole Wheat Sliced Bread",
            tags: ["bakery", "grains", "bread"],
            imagePlaceholder: "🍞"
        }
    ]
}


function StoreView() {

    const [cart, setCart] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    const handleAddToCart = (itemToAdd) => {
        const existingItem = cart.find(cartItem => cartItem.id === itemToAdd.id);
        if (existingItem) {
            const updatedCart = cart.map(cartItem =>
                cartItem.id === itemToAdd.id
                    ? { ...cartItem, quantity: (cartItem.quantity || 1) + 1 }
                    : cartItem 
            );
            setCart(updatedCart);
        } else {
            setCart([...cart, { ...itemToAdd, quantity: 1}])
        }


        setTotalPrice(prevPrice => prevPrice + itemToAdd.price);
    }

    return (
        <div className="store-view">
            <div className="store-header">
                <button>←</button> 
                <h2>{storeData.name}</h2>
                <button>↻</button>
            </div>

            <div className="item-list">
                {storeData.items.map(item => (
                    <div className="item-card" key={item.id}>
                        <div className="item-info">
                            <span className="item-image">{item.imagePlaceholder}</span>
                            <h3>{item.name}</h3>
                        </div>
                        <div className="item-actions">
                            <p>€{item.price.toFixed(2)}</p>
                            <button>Sale?</button>
                            <button onClick={() => handleAddToCart(item)}>Add</button>
                        </div>
                    </div>
                ))}
            </div>
            <div className='cart-summary'>
                <h3>Shopping Cart</h3>
                {cart.length === 0 ? (
                    <p>Your cart is empty.</p>
                ) : (
                    <div>
                        {cart.map(cartItem => (
                            <div className='cart-item' key={cartItem.id}>
                                <span>{cartItem.name} x {cartItem.quantity}</span>
                                <span>€ {(cartItem.price * cartItem.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                        <hr />
                        <div className='cart-total'>
                            <strong>Total:</strong>
                            <strong>€{totalPrice.toFixed(2)}</strong>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default StoreView;