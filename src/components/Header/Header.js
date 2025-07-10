import './Header.css';

function Header({ currentView, storeName, onBack, hasPriceUpdates, onRefreshPrices }) {
  const getTitle = () => {
    switch(currentView) {
      case 'store': return storeName || 'Store';
      case 'cart': return 'Shopping Cart';
      case 'map': return 'Map';
      default: return '';
    }
  };

  const showBackButton = currentView !== 'map';
  const showRefreshButton = currentView === 'store' || currentView === 'cart';
  
  return (
    <div className="sub-header">
      <div className="sub-header-left">
        {showBackButton && <button className="back-button" onClick={onBack}>← Back</button>}
      </div>
      
      <h2 className="sub-header-title">{getTitle()}</h2>

      <div className="sub-header-right">
        {showRefreshButton && (
          <>
            {hasPriceUpdates && <span className="update-text">Update!</span>}
            <button
              className={`refresh-button ${hasPriceUpdates ? 'refresh-attention' : ''}`}
              onClick={onRefreshPrices}
            >
              ↻
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Header;