import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useStore from "../hooks/useGlobalReducer";

export const Home = () => {
    const { store, dispatch } = useStore();
    const [search, setSearch] = useState("");

    useEffect(() => {
        const endpoints = ["people", "planets", "vehicles"];
        const storedPeople = localStorage.getItem("people");
        const storedPlanets = localStorage.getItem("planets");
        const storedVehicles = localStorage.getItem("vehicles");

        if (storedPeople && storedPlanets && storedVehicles) {
            dispatch({ type: "set_people", payload: JSON.parse(storedPeople) });
            dispatch({ type: "set_planets", payload: JSON.parse(storedPlanets) });
            dispatch({ type: "set_vehicles", payload: JSON.parse(storedVehicles) });
        } else {
            endpoints.forEach(type => {
                fetch(`https://www.swapi.tech/api/${type}`)
                    .then(res => res.json())
                    .then(data => {
                        dispatch({ type: `set_${type}`, payload: data.results });
                        localStorage.setItem(type, JSON.stringify(data.results));
                    })
                    .catch(err => console.error(`Error en ${type}:`, err));
            });
        }
    }, []);

    const toggleFavorite = (name) => {
        store.favorites.includes(name) 
            ? dispatch({ type: "delete_favorite", payload: name }) 
            : dispatch({ type: "add_favorite", payload: name });
    };

    const filteredPeople = store.people?.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
    const filteredPlanets = store.planets?.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
    const filteredVehicles = store.vehicles?.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));

    const renderCard = (item, type) => (
        <div key={item.uid} className="card text-white border-secondary me-3 shadow" style={{ minWidth: "18rem", backgroundColor: "rgba(25, 25, 25, 0.7)", backdropFilter: "blur(5px)" }}>
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

            <h2 className="text-warning mb-4 fw-bold">Characters</h2>
            <div className="d-flex flex-row overflow-auto mb-5 pb-3 custom-scrollbar">
                {filteredPeople?.map(item => renderCard(item, "people"))}
            </div>

            <h2 className="text-warning mb-4 fw-bold">Planets</h2>
            <div className="d-flex flex-row overflow-auto mb-5 pb-3 custom-scrollbar">
                {filteredPlanets?.map(item => renderCard(item, "planets"))}
            </div>

            <h2 className="text-warning mb-4 fw-bold">Vehicles</h2>
            <div className="d-flex flex-row overflow-auto mb-5 pb-3 custom-scrollbar">
                {filteredVehicles?.map(item => renderCard(item, "vehicles"))}
            </div>
        </div>
    );
};