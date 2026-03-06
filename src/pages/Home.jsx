import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { Loader } from "../components/Loader";
import { ACTION_TYPES } from "../store";
import { getPlaceholderImage, getResourceImageUrl, loadCatalog } from "../services/swapi";

export const Home = () => {
    const { store, dispatch } = useGlobalReducer();
    const [search, setSearch] = useState("");

    useEffect(() => {
        loadCatalog(dispatch, { hasLoaded: store.status.catalog.hasLoaded });
    }, [dispatch, store.status.catalog.hasLoaded]);

    const isFavorite = (item, type) =>
        store.favorites.some(
            (favorite) => favorite.uid === String(item.uid) && favorite.type === type
        );

    const toggleFavorite = (item, type) => {
        dispatch({
            type: ACTION_TYPES.toggleFavorite,
            payload: { uid: item.uid, type, name: item.name }
        });
    };

    const filterItems = (items = []) =>
        items.filter((item) =>
            item.name.toLowerCase().includes(search.toLowerCase())
        );

    const filteredPeople = filterItems(store.catalog.people);
    const filteredPlanets = filterItems(store.catalog.planets);
    const filteredVehicles = filterItems(store.catalog.vehicles);

    const renderCard = (item, type) => {
        const favorite = isFavorite(item, type);

        return (
            <div key={item.uid} className="card text-white border-secondary me-3 shadow" style={{ minWidth: "18rem", backgroundColor: "rgba(25, 25, 25, 0.7)", backdropFilter: "blur(5px)" }}>
                <img 
                    src={getResourceImageUrl(type, item.uid)} 
                    className="card-img-top" 
                    style={{ height: type === "vehicles" ? "200px" : "300px", objectFit: "cover" }}
                    onError={e => e.target.src = getPlaceholderImage()} 
                />
                <div className="card-body">
                    <h5 className="card-title fw-bold">{item.name}</h5>
                    <div className="d-flex justify-content-between mt-4">
                        <Link to={`/${type}/${item.uid}`} className="btn btn-outline-primary px-4">Learn more!</Link>
                        <button className={`btn ${favorite ? "btn-warning" : "btn-outline-warning"}`} onClick={() => toggleFavorite(item, type)}>
                            <i className={favorite ? "fas fa-heart text-danger" : "far fa-heart"}></i>
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    if (store.status.catalog.isLoading) {
        return <Loader text="Loading characters, planets and vehicles..." />;
    }

    if (store.status.catalog.error) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger d-flex justify-content-between align-items-center">
                    <span>{store.status.catalog.error}</span>
                    <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() =>
                            loadCatalog(dispatch, {
                                hasLoaded: store.status.catalog.hasLoaded,
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

    return (
        <div className="container mt-5" style={{ backgroundColor: "transparent" }}>
            
            {/* Cabecera y Buscador */}
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

            {/* Listas horizontales de Personajes, Planetas y Vehículos */}
            <h2 className="text-warning mb-4 fw-bold">Characters</h2>
            <div className="d-flex flex-row overflow-auto mb-5 pb-3 custom-scrollbar">
                {filteredPeople.length > 0 ? filteredPeople.map(item => renderCard(item, "people")) : (
                    <div className="alert alert-secondary mb-0">No characters found.</div>
                )}
            </div>

            <h2 className="text-warning mb-4 fw-bold">Planets</h2>
            <div className="d-flex flex-row overflow-auto mb-5 pb-3 custom-scrollbar">
                {filteredPlanets.length > 0 ? filteredPlanets.map(item => renderCard(item, "planets")) : (
                    <div className="alert alert-secondary mb-0">No planets found.</div>
                )}
            </div>

            <h2 className="text-warning mb-4 fw-bold">Vehicles</h2>
            <div className="d-flex flex-row overflow-auto mb-5 pb-3 custom-scrollbar">
                {filteredVehicles.length > 0 ? filteredVehicles.map(item => renderCard(item, "vehicles")) : (
                    <div className="alert alert-secondary mb-0">No vehicles found.</div>
                )}
            </div>
        </div>
    );
};
