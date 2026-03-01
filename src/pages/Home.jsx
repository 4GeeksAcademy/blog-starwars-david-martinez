import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useStore from "../hooks/useGlobalReducer";

export const Home = () => {
    // Traigo el store y el dispatch de mi hook global
    const { store, dispatch } = useStore();
    // Estado local para lo que el usuario escribe en el buscador
    const [search, setSearch] = useState("");

    useEffect(() => {
        // Defino las categorías que quiero pedir a la API
        const endpoints = ["people", "planets", "vehicles"];
        
        // REVISO EL NAVEGADOR: ¿Ya pedimos estos datos antes? 
        // Si ya están guardados, los usamos para que la página cargue instantáneo
        const storedPeople = localStorage.getItem("people");
        const storedPlanets = localStorage.getItem("planets");
        const storedVehicles = localStorage.getItem("vehicles");

        if (storedPeople && storedPlanets && storedVehicles) {
            // Si los encontré, aviso al Reducer para que los guarde en el estado global
            dispatch({ type: "set_people", payload: JSON.parse(storedPeople) });
            dispatch({ type: "set_planets", payload: JSON.parse(storedPlanets) });
            dispatch({ type: "set_vehicles", payload: JSON.parse(storedVehicles) });
        } else {
            // Si NO están guardados, recorro cada categoría y hago el fetch a la API
            endpoints.forEach(type => {
                fetch(`https://www.swapi.tech/api/${type}`)
                    .then(res => res.json())
                    .then(data => {
                        // Guardo el resultado en el estado global
                        dispatch({ type: `set_${type}`, payload: data.results });
                        // Y también lo guardo en el LocalStorage para la próxima vez
                        localStorage.setItem(type, JSON.stringify(data.results));
                    })
                    .catch(err => console.error(`Ups, hubo un error en ${type}:`, err));
            });
        }
    }, []); // El [] vacío significa que esto solo corre una vez al principio

    // FUNCIÓN PARA EL BOTÓN DE CORAZÓN
    const toggleFavorite = (name) => {
        // Si el nombre ya está en favoritos, lo borro. Si no está, lo agrego.
        store.favorites.includes(name) 
            ? dispatch({ type: "delete_favorite", payload: name }) 
            : dispatch({ type: "add_favorite", payload: name });
    };

    // FILTRO DE BÚSQUEDA: Comparo lo que hay en el store con lo que el usuario escribe
    // Uso toLowerCase() para que no importe si escriben en mayúsculas o minúsculas
    const filteredPeople = store.people?.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
    const filteredPlanets = store.planets?.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
    const filteredVehicles = store.vehicles?.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));

    // ESTO ES MI "PLANTILLA" PARA LAS CARTAS
    // Así no tengo que repetir el código de la carta 3 veces abajo
    const renderCard = (item, type) => (
        <div key={item.uid} className="card text-white border-secondary me-3 shadow" style={{ minWidth: "18rem", backgroundColor: "rgba(25, 25, 25, 0.7)", backdropFilter: "blur(5px)" }}>
            {/* Busco la imagen usando el ID único (uid). Si no existe, pongo una por defecto */}
            <img 
                src={`https://raw.githubusercontent.com/tbone849/star-wars-guide/master/build/assets/img/${type === "people" ? "characters" : type}/${item.uid}.jpg`} 
                className="card-img-top" 
                style={{ height: type === "vehicles" ? "200px" : "300px", objectFit: "cover" }}
                onError={e => e.target.src = "https://starwars-visualguide.com/assets/img/placeholder.jpg"} 
            />
            <div className="card-body">
                <h5 className="card-title fw-bold">{item.name}</h5>
                <div className="d-flex justify-content-between mt-4">
                    {/* Botón para ir a la página de detalles */}
                    <Link to={`/single/${type}/${item.uid}`} className="btn btn-outline-primary px-4">Learn more!</Link>
                    {/* Botón de favorito: cambia el color del corazón si ya es favorito */}
                    <button className="btn btn-outline-warning" onClick={() => toggleFavorite(item.name)}>
                        <i className={store.favorites.includes(item.name) ? "fas fa-heart text-danger" : "far fa-heart"}></i>
                    </button>
                </div>
            </div>
        </div>
    );

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
                {/* Mapeo la lista filtrada para crear una carta por cada personaje */}
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


/// Con los comentarios como me dije Erwin :D 