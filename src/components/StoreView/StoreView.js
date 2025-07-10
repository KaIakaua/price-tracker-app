import { useState } from 'react';
import './StoreView.css';

function StoreView({ store, onAddToCart, onReportSale, onRefreshPrices, onGoToMap, hasPriceUpdates }) {
    const [expandedItemId, setExpandedItemId] = useState(null);
    const [saleReportItemId, setSaleReportItemId] = useState(null);
    const [salePriceInput, setSalePriceInput] = useState('');

    const handleToggleExpand = (itemId) => {
        setExpandedItemId(prevId => (prevId === itemId ? null : itemId));
    };

    const handleOpenSaleForm = (item) => {
        setExpandedItemId(null);
        setSaleReportItemId(item.id);
        setSalePriceInput('');
    };
    
    const handleSaleSubmit = (e, itemId) => {
        e.preventDefault();
        const price = parseFloat(salePriceInput);

        if (isNaN(price) || price <= 0) {
            alert("Please enter a valid sale price.");
            return;
        }

        onReportSale(itemId, price);
        setSaleReportItemId(null);
    };

    if (!store) {
        return (
            <div className='store-view-placeholder'>
                <h2>No store selected</h2>
                <p>Please select a store from the map to see its products.</p>
            </div>
        );
    }

    return (
        <div className="store-view">
            <div className="store-header">
                <button onClick={onGoToMap}>←</button>
                <h2>{store.name}</h2>
                <div className='refresh-container'>
                    {hasPriceUpdates && <span className='update-text'>Price Update!</span>}
                    <button 
                        className={`refresh-button ${hasPriceUpdates ? 'refresh-attention' : ''}`}
                        onClick={onRefreshPrices}
                    >
                        ↻
                    </button>
                </div>
            </div>

            <div className="item-list">
                {store.items.map(item => (
                    <div className="item-card-wrapper" key={item.id}>
                        <div className="item-card">
                            <div className="item-content" onClick={() => handleToggleExpand(item.id)}>
                                <h3>{item.name.toUpperCase()}</h3>
                                <div className="item-image-box">
                                    <span>{item.imagePlaceholder}</span>
                                </div>
                            </div>
                            <div className="item-actions-vertical">
                                <div className='price-display'>
                                    {item.salePrice ? (
                                        <>
                                            <span className="sale-price">€{item.salePrice.toFixed(2)}</span>
                                            <span className="original-price">€{item.price.toFixed(2)}</span>
                                        </>
                                    ) : (
                                        <span className="regular-price">€{item.price.toFixed(2)}</span>
                                    )} 
                                    <span className="price-unit"> /{item.unit}</span>
                                </div>
                                <button className="add-button" onClick={() => onAddToCart(item)}>ADD</button>
                            </div>
                        </div>

                        {expandedItemId === item.id && (
                            <div className="item-details">
                                <p><strong>Full Name:</strong> {item.fullName}</p>
                                <hr/>
                                <p><strong>Regular Price:</strong> €{item.price.toFixed(2)}</p>
                                {item.salePrice && (
                                    <>
                                        <p><strong>Sale Price:</strong> €{item.salePrice.toFixed(2)}</p>
                                        <p><strong>Discount:</strong> {Math.round(((item.price - item.salePrice) / item.price) * 100)}% off</p>
                                    </>
                                )}
                                <hr/>
                                <button className='sale-button' onClick={(e) => { e.stopPropagation(); handleOpenSaleForm(item); }}>Report new Sale</button>
                            </div>
                        )}
                        {saleReportItemId === item.id && (
                            <div className='item-details sale-form'>
                                <form onSubmit={(e) => handleSaleSubmit(e, item.id)}>
                                    <label>Enter Sale Price: </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        placeholder='e.g., 1.99'
                                        value={salePriceInput}
                                        onChange={(e) => setSalePriceInput(e.target.value)}
                                        onClick={(e) => e.stopPropagation()}
                                        autoFocus
                                    />
                                    <button type="submit">Submit Sale</button>
                                </form>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default StoreView;