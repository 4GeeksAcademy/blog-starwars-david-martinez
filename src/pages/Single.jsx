import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export const Single = () => {
    const { type, uid } = useParams();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Cada vez que el ID o el tipo cambien en la URL, reinicio el cargando.
        setLoading(true);
        // FETCH DINÁMICO: Uso las variables de la ruta para pedir los datos a la API.
        fetch(`https://www.swapi.tech/api/${type}/${uid}`)
            .then(res => res.json())
            .then(data => {
                // Guardo solo las propiedades técnicas (properties) en mi estado.
                setItem(data.result.properties);
                setLoading(false); // Quito el aviso de carga.
            })
            .catch(err => {
                console.error("Error fetching details:", err);
                setLoading(false);
            });
    }, [type, uid]); // Este efecto depende de la URL para actualizarse solo si el usuario cambia de vista.

    //  PANTALLA DE CARGA: Si la API aún no responde, muestro un spinner de Bootstrap.
    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: "60vh" }}>
            <div className="spinner-border text-warning" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );

    return (
        <div className="container mt-5">
            {/* Tarjeta Principal: Uso bg-opacity para que el fondo dinámico se vea un poco por detrás */}
            <div className="card mb-3 bg-black bg-opacity-75 text-white border-warning shadow-lg overflow-hidden">
                <div className="row g-0">
                    <div className="col-md-6">
                        {/* Ajusto la carpeta a 'characters' si el tipo es 'people' */}
                        <img 
                            src={`https://raw.githubusercontent.com/tbone849/star-wars-guide/master/build/assets/img/${type === "people" ? "characters" : type}/${uid}.jpg`}
                            className="img-fluid w-100 h-100"
                            style={{ objectFit: "cover", minHeight: "400px" }}
                            alt={item?.name}
                            // Si la imagen da error (no existe en el server), pongo una por defecto.
                            onError={e => e.target.src = "https://starwars-visualguide.com/assets/img/placeholder.jpg"}
                        />
                    </div>
                    <div className="col-md-6 d-flex flex-column justify-content-center p-4">
                        <h1 className="display-4 text-warning fw-bold mb-3">{item?.name}</h1>
                        
                        {/*  Uso un ternario para mostrar una descripción u otra según el tipo */}
                        <p className="lead fs-4">
                            {type === "people" 
                                ? `${item?.name} is a fascinating character with ${item?.eye_color} eyes and ${item?.hair_color} hair. Born in the year ${item?.birth_year}, this individual stands ${item?.height}cm tall and has played a significant role in the galactic history.`
                                : `${item?.name} is a celestial body characterized by its ${item?.climate} climate and ${item?.terrain} terrain. It maintains an orbital period of ${item?.orbital_period} days and supports a population of approximately ${item?.population} inhabitants.`
                            }
                        </p>
                    </div>
                </div>
            </div>

            {/* Divido la información en columnas y muestro una u otra según el tipo */}
            <div className="row text-center mt-5 py-3 border-top border-warning text-warning fw-bold bg-black bg-opacity-50 rounded">
                {/* CAMPOS ESPECÍFICOS PARA PERSONAJES */}
                {type === "people" && (
                    <>
                        <div className="col-md-2 col-6 mb-3">Name<br/><span className="text-white fw-normal">{item?.name}</span></div>
                        <div className="col-md-2 col-6 mb-3">Birth Year<br/><span className="text-white fw-normal">{item?.birth_year}</span></div>
                        <div className="col-md-2 col-6 mb-3">Gender<br/><span className="text-white fw-normal">{item?.gender}</span></div>
                        <div className="col-md-2 col-6 mb-3">Height<br/><span className="text-white fw-normal">{item?.height}</span></div>
                        <div className="col-md-2 col-6 mb-3">Skin Color<br/><span className="text-white fw-normal">{item?.skin_color}</span></div>
                        <div className="col-md-2 col-6 mb-3">Eye Color<br/><span className="text-white fw-normal">{item?.eye_color}</span></div>
                    </>
                )}
                {/* CAMPOS ESPECÍFICOS PARA PLANETAS */}
                {type === "planets" && (
                    <>
                        <div className="col-md-2 col-6 mb-3">Climate<br/><span className="text-white fw-normal">{item?.climate}</span></div>
                        <div className="col-md-2 col-6 mb-3">Population<br/><span className="text-white fw-normal">{item?.population}</span></div>
                        <div className="col-md-2 col-6 mb-3">Orbital Period<br/><span className="text-white fw-normal">{item?.orbital_period}</span></div>
                        <div className="col-md-2 col-6 mb-3">Rotation Period<br/><span className="text-white fw-normal">{item?.rotation_period}</span></div>
                        <div className="col-md-2 col-6 mb-3">Diameter<br/><span className="text-white fw-normal">{item?.diameter}</span></div>
                        <div className="col-md-2 col-6 mb-3">Terrain<br/><span className="text-white fw-normal">{item?.terrain}</span></div>
                    </>
                )}
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