import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import useStore from "../hooks/useGlobalReducer";
import { loadDetail } from "../services/swapi";

export const Single = () => {
    const { type, uid } = useParams();
    const { store, dispatch } = useStore();

    // Verificamos si ya tenemos el detalle en el store (caché)
    const detailKey = `${type}-${uid}`;
    const item = store.details[detailKey];

    useEffect(() => {
        loadDetail(dispatch, { type, uid: String(uid), cachedDetail: item });
    }, [dispatch, type, uid, item]);

    if (store.status.detail.error && !item) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger d-flex justify-content-between align-items-center">
                    <span>{store.status.detail.error}</span>
                    <button type="button" className="btn btn-outline-danger btn-sm"
                        onClick={() => loadDetail(dispatch, { type, uid: String(uid), forceReload: true })}>
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (store.status.detail.loading || !item) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "60vh" }}>
                <div className="spinner-border text-warning" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <div className="card mb-3 bg-black bg-opacity-75 text-white border-warning shadow-lg overflow-hidden">
                <div className="row g-0">
                    <div className="col-md-6">
                        <img 
                            src={`https://raw.githubusercontent.com/tbone849/star-wars-guide/master/build/assets/img/${type === "people" ? "characters" : type}/${uid}.jpg`}
                            className="img-fluid w-100 h-100"
                            style={{ objectFit: "cover", minHeight: "400px" }}
                            alt={item.name}
                            onError={e => e.target.src = "https://starwars-visualguide.com/assets/img/placeholder.jpg"}
                        />
                    </div>
                    <div className="col-md-6 d-flex flex-column justify-content-center p-4">
                        <h1 className="display-4 text-warning fw-bold mb-3">{item.name}</h1>
                        
                        <p className="lead fs-4">
                            {type === "people" && `${item.name} is a fascinating character with ${item.eye_color} eyes and ${item.hair_color} hair. Born in ${item.birth_year}.`}
                            {type === "planets" && `${item.name} is a celestial body characterized by its ${item.climate} climate and ${item.terrain} terrain.`}
                            {type === "vehicles" && `${item.name} is a ${item.vehicle_class} vehicle manufactured by ${item.manufacturer}, capable of carrying ${item.passengers} passengers.`}
                        </p>
                    </div>
                </div>
            </div>

            <div className="row text-center mt-5 py-3 border-top border-warning text-warning fw-bold bg-black bg-opacity-50 rounded">
                {type === "people" && (
                    <>
                        <div className="col-md-2 col-6 mb-3">Name<br/><span className="text-white fw-normal">{item.name}</span></div>
                        <div className="col-md-2 col-6 mb-3">Birth Year<br/><span className="text-white fw-normal">{item.birth_year}</span></div>
                        <div className="col-md-2 col-6 mb-3">Gender<br/><span className="text-white fw-normal">{item.gender}</span></div>
                        <div className="col-md-2 col-6 mb-3">Height<br/><span className="text-white fw-normal">{item.height}</span></div>
                        <div className="col-md-2 col-6 mb-3">Skin Color<br/><span className="text-white fw-normal">{item.skin_color}</span></div>
                        <div className="col-md-2 col-6 mb-3">Eye Color<br/><span className="text-white fw-normal">{item.eye_color}</span></div>
                    </>
                )}
                {type === "planets" && (
                    <>
                        <div className="col-md-2 col-6 mb-3">Climate<br/><span className="text-white fw-normal">{item.climate}</span></div>
                        <div className="col-md-2 col-6 mb-3">Population<br/><span className="text-white fw-normal">{item.population}</span></div>
                        <div className="col-md-2 col-6 mb-3">Orbital Period<br/><span className="text-white fw-normal">{item.orbital_period}</span></div>
                        <div className="col-md-2 col-6 mb-3">Rotation<br/><span className="text-white fw-normal">{item.rotation_period}</span></div>
                        <div className="col-md-2 col-6 mb-3">Diameter<br/><span className="text-white fw-normal">{item.diameter}</span></div>
                        <div className="col-md-2 col-6 mb-3">Terrain<br/><span className="text-white fw-normal">{item.terrain}</span></div>
                    </>
                )}
                {type === "vehicles" && (
                    <>
                        <div className="col-md-2 col-6 mb-3">Model<br/><span className="text-white fw-normal">{item.model}</span></div>
                        <div className="col-md-2 col-6 mb-3">Class<br/><span className="text-white fw-normal">{item.vehicle_class}</span></div>
                        <div className="col-md-2 col-6 mb-3">Cost<br/><span className="text-white fw-normal">{item.cost_in_credits}</span></div>
                        <div className="col-md-2 col-6 mb-3">Speed<br/><span className="text-white fw-normal">{item.max_atmosphering_speed}</span></div>
                        <div className="col-md-2 col-6 mb-3">Cargo<br/><span className="text-white fw-normal">{item.cargo_capacity}</span></div>
                        <div className="col-md-2 col-6 mb-3">Length<br/><span className="text-white fw-normal">{item.length}</span></div>
                    </>
                )}
            </div>

            <div className="mt-4 mb-5">
                <Link to="/" className="btn btn-outline-warning btn-lg px-5 shadow">
                    <i className="fas fa-arrow-left me-2"></i> Back Home
                </Link>
            </div>
        </div>
    );
};