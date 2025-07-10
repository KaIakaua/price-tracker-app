import { useState, useEffect } from 'react';
import './App.css';
import { stores as initialStoresData } from './components/mockDatabase/mockDatabase';
import MapView from './components/MapView/MapView';
import StoreView from './components/StoreView/StoreView';
import ShoppingCart from './components/ShoppingCart/ShoppingCart';

function App() {
  const [stores, setStores] = useState(initialStoresData);
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [currentView, setCurrentView] = useState('map');
  const [selectedStoreId, setSelectedStoreId] = useState(null);
  const [hasPriceUpdates, setHasPriceUpdates] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      let updatesFound = false;
      for (const store of stores) {
        for (const item of store.items) {
          if (item.salePriceExpiresAt && Date.now() > item.salePriceExpiresAt) {
            updatesFound = true;
            break;
          }
        }
        if (updatesFound) break;
      }
      setHasPriceUpdates(updatesFound);
    }, 5000);

    return () => clearInterval(interval);
  }, [stores]);

  const handleAddToCart = (itemToAdd) => {
    const existingItem = cart.find(cartItem => cartItem.id === itemToAdd.id);
    if (existingItem) {
        const updatedCart = cart.map(cartItem =>
            cartItem.id === itemToAdd.id
                ? { ...cartItem, quantity: (cartItem.quantity || 0) + 1 }
                : cartItem 
        );
        setCart(updatedCart);
    } else {
        setCart([...cart, { ...itemToAdd, quantity: 1}]);
    }
    const priceToUse = itemToAdd.salePrice || itemToAdd.price;
    setTotalPrice(prevPrice => prevPrice + priceToUse);
  };

  const handleRemoveFromCart = (itemToRemove) => {
    const existingItem = cart.find(cartItem => cartItem.id === itemToRemove.id);
    if (!existingItem) return;
    
    if (existingItem.quantity === 1) {
        const updatedCart = cart.filter(cartItem => cartItem.id !== itemToRemove.id);
        setCart(updatedCart);
    } else {
        const updatedCart = cart.map(cartItem => 
            cartItem.id === itemToRemove.id
                ? { ...cartItem, quantity: cartItem.quantity - 1 }
                : cartItem
        );
        setCart(updatedCart);
    }
    const priceToUse = itemToRemove.salePrice || itemToRemove.price;
    setTotalPrice(prevPrice => prevPrice - priceToUse);
  };

  const handleClearCart = () => {
    setCart([]);
    setTotalPrice(0);
  };

  const handleBuy = () => {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    alert(`Thank you for your purchase!\nTotal: €${totalPrice.toFixed(2)}`);
    handleClearCart();
  };

  const handleSelectStore = (storeId) => {
    setSelectedStoreId(storeId);
    setCurrentView('store');
  };

  const handleGoToMap = () => {
    setCurrentView('map');
  };

  const handleReportSale = (itemId, newSalePrice) => {
    const expirationTime = Date.now() + 10000;

    setStores(currentStores => {
      const newStores = JSON.parse(JSON.stringify(currentStores));
      for (const store of newStores) {
        const itemToUpdate = store.items.find(item => item.id === itemId);
        if (itemToUpdate) {
          if (!itemToUpdate.hasOwnProperty('originalSalePrice')) {
            itemToUpdate.originalSalePrice = itemToUpdate.salePrice;
          }
          itemToUpdate.salePrice = newSalePrice;
          itemToUpdate.salePriceExpiresAt = expirationTime;
          break;
        }
      }
      return newStores;
    });
    alert('Thank you! The sale price has been submitted.');
  };

  const handleRefreshPrices = () => {
    const newStores = JSON.parse(JSON.stringify(stores));
    for (const store of newStores) {
      for (const item of store.items) {
        if (item.salePriceExpiresAt && Date.now() > item.salePriceExpiresAt) {
          item.salePrice = item.originalSalePrice;
          item.salePriceExpiresAt = null;
        }
      }
    }

    const updatedCart = cart.map(cartItem => {
      let freshItemData = null;
      for (const store of newStores) {
        const foundItem = store.items.find(item => item.id === cartItem.id);
        if (foundItem) {
          freshItemData = foundItem;
          break;
        }
      }
      return { ...freshItemData, quantity: cartItem.quantity };
    });

    const newTotalPrice = updatedCart.reduce((total, item) => {
      const priceToUse = item.salePrice || item.price;
      return total + (priceToUse * item.quantity);
    }, 0);

    setStores(newStores);
    setCart(updatedCart);
    setTotalPrice(newTotalPrice);
    setHasPriceUpdates(false);
  };

  const selectedStore = stores.find(store => store.id === selectedStoreId);

  return (
    <div className="App">
      <nav className='top-nav'>
        <button onClick={() => setCurrentView('map')}>Map</button>
        <button onClick={() => setCurrentView('store')} disabled={!selectedStoreId}>Store</button>
        <button onClick={() => setCurrentView('cart')}>Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})</button>
      </nav>

      <main className='main-content'>
        {currentView === 'map' && <MapView stores={stores} onSelectStore={handleSelectStore} />}
        {currentView === 'store' && 
          <StoreView 
            store={selectedStore} 
            onAddToCart={handleAddToCart}
            onReportSale={handleReportSale}
            onRefreshPrices={handleRefreshPrices}
            onGoToMap={handleGoToMap}
            hasPriceUpdates={hasPriceUpdates}
          />
        }
        {currentView === 'cart' && 
          <ShoppingCart 
            cart={cart} 
            totalPrice={totalPrice} 
            onAdd={handleAddToCart} 
            onRemove={handleRemoveFromCart} 
            onClear={handleClearCart} 
            onBuy={handleBuy} 
          />
        }
      </main>
    </div>
  );
}

export default App;