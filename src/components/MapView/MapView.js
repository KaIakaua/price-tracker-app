import './MapView.css';

function MapView( { stores, onSelectStore }) {
    return (
        <div className='map-view'>
            <h1>Store Map</h1>
            <p>Stores around your current zone.</p>
            <div className='store-list-container'>
                {stores.map(store => (
                    <button key={store.id} onClick={() => onSelectStore(store.id)}>
                        {store.name}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default MapView;