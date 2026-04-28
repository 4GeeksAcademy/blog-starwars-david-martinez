export const ACTION_TYPES = {
    loadCatalogStart: 'load_catalog_start',
    loadCatalogSuccess: 'load_catalog_success',
    loadCatalogError: 'load_catalog_error',
    loadDetailStart: 'load_detail_start',
    loadDetailSuccess: 'load_detail_success',
    loadDetailError: 'load_detail_error',
    toggleFavorite: 'toggle_favorite',
    deleteFavorite: 'delete_favorite'
};

export const initialStore = () => ({
    people: [],
    planets: [],
    vehicles: [],
    favorites: [], // Array de objetos { uid, type, name }
    details: {},   // Caché para guardar detalles cargados: { "people-1": {...} }
    status: {
        catalog: { hasLoaded: false, loading: false, error: null },
        detail: { loading: false, error: null }
    }
});

export default function storeReducer(store, action = {}) {
    switch(action.type) {
        case ACTION_TYPES.loadCatalogStart:
            return { ...store, status: { ...store.status, catalog: { ...store.status.catalog, loading: true, error: null } } };
            
        case ACTION_TYPES.loadCatalogSuccess:
            return {
                ...store,
                people: action.payload.people,
                planets: action.payload.planets,
                vehicles: action.payload.vehicles,
                status: { ...store.status, catalog: { hasLoaded: true, loading: false, error: null } }
            };
            
        case ACTION_TYPES.loadCatalogError:
            return { ...store, status: { ...store.status, catalog: { ...store.status.catalog, loading: false, error: action.payload } } };

        case ACTION_TYPES.loadDetailStart:
            return { ...store, status: { ...store.status, detail: { loading: true, error: null } } };
            
        case ACTION_TYPES.loadDetailSuccess:
            const key = `${action.payload.type}-${action.payload.uid}`;
            return {
                ...store,
                details: { ...store.details, [key]: action.payload.data },
                status: { ...store.status, detail: { loading: false, error: null } }
            };
            
        case ACTION_TYPES.loadDetailError:
            return { ...store, status: { ...store.status, detail: { loading: false, error: action.payload } } };

        case ACTION_TYPES.toggleFavorite: {
            const favorite = {
                uid: String(action.payload.uid),
                type: action.payload.type,
                name: action.payload.name,
            };
            const exists = store.favorites.some(item => item.uid === favorite.uid && item.type === favorite.type);

            return exists
                ? { ...store, favorites: store.favorites.filter(item => !(item.uid === favorite.uid && item.type === favorite.type)) }
                : { ...store, favorites: [...store.favorites, favorite] };
        }

        case ACTION_TYPES.deleteFavorite:
            return {
                ...store,
                favorites: store.favorites.filter(item => !(item.uid === String(action.payload.uid) && item.type === action.payload.type))
            };

        default:
            return store;
    }
}