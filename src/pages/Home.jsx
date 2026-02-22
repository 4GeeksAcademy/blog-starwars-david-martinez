import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import useStore from "../hooks/useGlobalReducer";

export const Home = () => {
    const { store, dispatch } = useStore();

    useEffect(() => {
        const endpoints = ["people", "planets", "vehicles"];
        endpoints.forEach(type => {
            fetch(`https://www.swapi.tech/api/${type}`)
                .then(res => res.json())
                .then(data => dispatch({ type: `set_${type}`, payload: data.results }))
                .catch(err => console.error(`Error en ${type}:`, err));
        });
    }, []);

    const toggleFavorite = (name) => {
        store.favorites.includes(name) 
            ? dispatch({ type: "delete_favorite", payload: name }) 
            : dispatch({ type: "add_favorite", payload: name });
    };

    const renderCard = (item, type) => (
        <div key={item.uid} className="card bg-dark text-white border-secondary me-3 shadow" style={{ minWidth: "18rem" }}>
            <img 
                src={`https://raw.githubusercontent.com/tbone849/star-wars-guide/master/build/assets/img/${type === "people" ? "characters" : type}/${item.uid}.jpg`} 
                className="card-img-top" 
                style={{ height: type === "vehicles" ? "200px" : "300px", objectFit: "cover" }}
                onError={e => e.target.src = "https://starwars-visualguide.com/assets/img/placeholder.jpg"} 
            />
            <div className="card-body">
                <h5 className="card-title fw-bold">{item.name}</h5>
                <div className="d-flex justify-content-between mt-4">
                    <Link to={`/single/${type}/${item.uid}`} className="btn btn-outline-primary px-4">Learn more!</Link>
                    <button className="btn btn-outline-warning" onClick={() => toggleFavorite(item.name)}>
                        <i className={store.favorites.includes(item.name) ? "fas fa-heart text-danger" : "far fa-heart"}></i>
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="container mt-5">
            <h2 className="text-warning mb-4 fw-bold">Characters</h2>
            <div className="d-flex flex-row overflow-auto mb-5 pb-3">{store.people?.map(item => renderCard(item, "people"))}</div>

            <h2 className="text-warning mb-4 fw-bold">Planets</h2>
            <div className="d-flex flex-row overflow-auto mb-5 pb-3">{store.planets?.map(item => renderCard(item, "planets"))}</div>

            <h2 className="text-warning mb-4 fw-bold">Vehicles</h2>
            <div className="d-flex flex-row overflow-auto mb-5 pb-3">{store.vehicles?.map(item => renderCard(item, "vehicles"))}</div>
        </div>
    );
};