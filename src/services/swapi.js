import { ACTION_TYPES } from "../store";

const fetchCategory = async (type) => {
    // Si ya está en localStorage, lo devolvemos rápido
    const cached = localStorage.getItem(type);
    if (cached) return JSON.parse(cached);

    const response = await fetch(`https://www.swapi.tech/api/${type}`);
    if (!response.ok) throw new Error(`Error cargando ${type}`);
    const data = await response.json();
    
    // Guardamos en caché
    localStorage.setItem(type, JSON.stringify(data.results));
    return data.results;
};

export const loadCatalog = async (dispatch, { hasLoaded = false, forceReload = false } = {}) => {
    if (hasLoaded && !forceReload) return;

    dispatch({ type: ACTION_TYPES.loadCatalogStart });

    try {
        const [people, planets, vehicles] = await Promise.all([
            fetchCategory("people"),
            fetchCategory("planets"),
            fetchCategory("vehicles"),
        ]);

        dispatch({
            type: ACTION_TYPES.loadCatalogSuccess,
            payload: { people, planets, vehicles },
        });
    } catch (error) {
        dispatch({
            type: ACTION_TYPES.loadCatalogError,
            payload: error.message || "No pudimos cargar el catálogo de Star Wars.",
        });
    }
};

export const loadDetail = async (dispatch, { type, uid, cachedDetail, forceReload = false }) => {
    // Si ya tenemos el detalle en el estado global (caché), no hacemos fetch de nuevo
    if (cachedDetail && !forceReload) return;

    dispatch({ type: ACTION_TYPES.loadDetailStart });

    try {
        const response = await fetch(`https://www.swapi.tech/api/${type}/${uid}`);
        if (!response.ok) throw new Error("Recurso no encontrado");
        const data = await response.json();

        dispatch({
            type: ACTION_TYPES.loadDetailSuccess,
            payload: { type, uid, data: data.result.properties }
        });
    } catch (error) {
        dispatch({
            type: ACTION_TYPES.loadDetailError,
            payload: "Error cargando los detalles. Inténtalo de nuevo."
        });
    }
};