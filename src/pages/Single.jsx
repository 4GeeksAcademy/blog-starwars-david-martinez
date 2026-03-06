import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { Loader } from "../components/Loader";
import { ACTION_TYPES } from "../store";
import {
    getDetailHighlights,
    getIntroText,
    getPlaceholderImage,
    getResourceImageUrl,
    isSupportedType,
    loadDetail
} from "../services/swapi";

export const Single = () => {
    const { type, uid } = useParams();
    const { store, dispatch } = useGlobalReducer();
    const item = isSupportedType(type)
        ? store.detailCache[type][String(uid)] || null
        : null;
    const highlights = getDetailHighlights(type, item?.properties);
    const isFavorite = store.favorites.some(
        (favorite) => favorite.uid === String(uid) && favorite.type === type
    );

    useEffect(() => {
        loadDetail(dispatch, {
            type,
            uid: String(uid),
            cachedDetail: item
        });
    }, [dispatch, type, uid]);

    if (!isSupportedType(type)) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger">Unsupported route. Choose a character, planet or vehicle from the home page.</div>
            </div>
        );
    }

    if (store.status.detail.isLoading && !item) {
        return <Loader text="Loading resource details..." />;
    }

    if (store.status.detail.error && !item) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger d-flex justify-content-between align-items-center">
                    <span>{store.status.detail.error}</span>
                    <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() =>
                            loadDetail(dispatch, {
                                type,
                                uid: String(uid),
                                cachedDetail: item,
                                forceReload: true
                            })
                        }
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (!item) {
        return (
            <div className="container mt-5">
                <div className="alert alert-warning">This resource is not available.</div>
            </div>
        );
    }

    const toggleFavorite = () => {
        dispatch({
            type: ACTION_TYPES.toggleFavorite,
            payload: { uid, type, name: item.name }
        });
    };

    return (
        <div className="container mt-5">
            {/* Tarjeta Principal: Uso bg-opacity para que el fondo dinámico se vea un poco por detrás */}
            <div className="card mb-3 bg-black bg-opacity-75 text-white border-warning shadow-lg overflow-hidden">
                <div className="row g-0">
                    <div className="col-md-6">
                        {/* Ajusto la carpeta a 'characters' si el tipo es 'people' */}
                        <img 
                            src={getResourceImageUrl(type, uid)}
                            className="img-fluid w-100 h-100"
                            style={{ objectFit: "cover", minHeight: "400px" }}
                            alt={item?.name}
                            onError={e => e.target.src = getPlaceholderImage()}
                        />
                    </div>
                    <div className="col-md-6 d-flex flex-column justify-content-center p-4">
                        <h1 className="display-4 text-warning fw-bold mb-3">{item?.name}</h1>
                        <p className="lead fs-4">{getIntroText(type, item?.properties)}</p>
                    </div>
                </div>
            </div>

            <div className="row text-center mt-5 py-3 border-top border-warning text-warning fw-bold bg-black bg-opacity-50 rounded">
                {highlights.map((highlight) => (
                    <div key={highlight.key} className="col-md-2 col-6 mb-3">
                        {highlight.label}
                        <br />
                        <span className="text-white fw-normal">{highlight.value}</span>
                    </div>
                ))}
            </div>

            <div className="mt-4">
                <button
                    type="button"
                    className={`btn btn-lg px-4 shadow ${isFavorite ? "btn-warning" : "btn-outline-warning"}`}
                    onClick={toggleFavorite}
                >
                    {isFavorite ? "💛 Remove favorite" : "🤍 Save favorite"}
                </button>
            </div>

            {/* BOTÓN DE RETORNO: Link para volver al Home sin recargar la página */}
            <div className="mt-4 mb-5">
                <Link to="/" className="btn btn-outline-warning btn-lg px-5 shadow">
                    <i className="fas fa-arrow-left me-2"></i> Back Home
                </Link>
            </div>
        </div>
    );
};
