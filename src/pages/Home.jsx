import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useStore from "../hooks/useGlobalReducer";
import { loadCatalog } from "../services/swapi";
import { ACTION_TYPES } from "../store";

export const Home = () => {
    const { store, dispatch } = useStore();
    const [search, setSearch] = useState("");

    useEffect(() => {
        // Toda la lógica HTTP está aislada en el servicio
        loadCatalog(dispatch, { hasLoaded: store.status.catalog.hasLoaded });
    }, [dispatch, store.status.catalog.hasLoaded]);

    const toggleFavorite = (item, type) => {
        dispatch({ type: ACTION_TYPES.toggleFavorite, payload: { uid: item.uid, type, name: item.name } });
    };

    const isFavorite = (uid, type) => {
        return store.favorites.some(fav => fav.uid === String(uid) && fav.type === type);
    };

    const filterList = (list) => {
        return list?.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
    };

    const renderCard = (item, type) => (
        <div key={item.uid} className="card text-white border-secondary me-3 shadow" style={{ minWidth: "18rem", backgroundColor: "rgba(25, 25, 25, 0.7)", backdropFilter: "blur(5px)" }}>
            <img 
                src={`https://raw.githubusercontent.com/tbone849/star-wars-guide/master/build/assets/img/${type === "people" ? "characters" : type}/${item.uid}.jpg`} 
                className="card-img-top" 
                style={{ height: type === "vehicles" ? "200px" : "300px", objectFit: "cover" }}
                onError={e => e.target.src = "https://starwars-visualguide.com/assets/img/placeholder.jpg"} 
                alt={item.name}
            />
            <div className="card-body">
                <h5 className="card-title fw-bold">{item.name}</h5>
                <div className="d-flex justify-content-between mt-4">
                    {/* RUTA CORREGIDA: Ya no usa /single/... */}
                    <Link to={`/${type}/${item.uid}`} className="btn btn-outline-primary px-4">Learn more!</Link>
                    <button className="btn btn-outline-warning" onClick={() => toggleFavorite(item, type)}>
                        <i className={isFavorite(item.uid, type) ? "fas fa-heart text-danger" : "far fa-heart"}></i>
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="container mt-5" style={{ backgroundColor: "transparent" }}>
            <div className="row mb-5 justify-content-center">
                <div className="col-md-8">
                    <h1 className="text-center text-white mb-4" style={{ fontFamily: 'Orbitron, sans-serif' }}>Explore the Star Wars Universe</h1>
                    <div className="input-group">
                        <span className="input-group-text bg-warning border-warning"><i className="fas fa-search"></i></span>
                        <input 
                            type="text" 
                            className="form-control form-control-lg text-white border-warning" 
                            style={{ backgroundColor: "rgba(0,0,0,0.6)" }} 
                            placeholder="Search characters, planets, vehicles..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {store.status.catalog.error && (
                <div className="alert alert-danger text-center shadow">
                    {store.status.catalog.error}
                    <button className="btn btn-danger ms-3 btn-sm" onClick={() => loadCatalog(dispatch, { forceReload: true })}>Retry</button>
                </div>
            )}

            {store.status.catalog.loading && !store.status.catalog.hasLoaded ? (
                <div className="text-center text-warning my-5">
                    <div className="spinner-border" role="status"></div>
                </div>
            ) : (
                <>
                    <h2 className="text-warning mb-4 fw-bold">Characters</h2>
                    <div className="d-flex flex-row overflow-auto mb-5 pb-3 custom-scrollbar">
                        {filterList(store.people)?.map(item => renderCard(item, "people"))}
                    </div>

                    <h2 className="text-warning mb-4 fw-bold">Planets</h2>
                    <div className="d-flex flex-row overflow-auto mb-5 pb-3 custom-scrollbar">
                        {filterList(store.planets)?.map(item => renderCard(item, "planets"))}
                    </div>

                    <h2 className="text-warning mb-4 fw-bold">Vehicles</h2>
                    <div className="d-flex flex-row overflow-auto mb-5 pb-3 custom-scrollbar">
                        {filterList(store.vehicles)?.map(item => renderCard(item, "vehicles"))}
                    </div>
                </>
            )}
        </div>
    );
};