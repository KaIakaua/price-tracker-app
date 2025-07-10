import './ShoppingCart.css';

function ShoppingCart({ cart, totalPrice, onRemove, onAdd, onClear, onBuy }) {
  if (cart.length === 0) {
    return (
      <div className="shopping-cart">
        <h2>Shopping Cart</h2>
        <p>Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="shopping-cart">
      <h2>Shopping Cart</h2>
      <div className="cart-items-list">
        {cart.map(cartItem => {
          const priceToUse = cartItem.salePrice || cartItem.price;
          
          return (
            <div className="cart-item" key={cartItem.id}>
              <span className="cart-item-name">
                {cartItem.imagePlaceholder}
                {cartItem.name}
              </span>
              <div className="cart-item-controls">
                <button onClick={() => onRemove(cartItem)}>-</button>
                <span>{cartItem.quantity}</span>
                <button onClick={() => onAdd(cartItem)}>+</button>
              </div>
              <span className="cart-item-price">
                €{(priceToUse * cartItem.quantity).toFixed(2)}
              </span>
            </div>
          );
        })}
      </div>
      <hr />
      <div className="cart-total-section">
        <div className="cart-total">
          <strong>Total:</strong>
          <strong>€{totalPrice.toFixed(2)}</strong>
        </div>
        <div className="cart-actions">
          <button className="clear-button" onClick={onClear}>Clear</button>
          <button className="buy-button" onClick={onBuy}>Buy</button>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCart;