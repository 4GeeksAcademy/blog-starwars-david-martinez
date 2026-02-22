import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

export const Single = () => {
    const { type, uid } = useParams(); // Deben coincidir con el router
    const [detail, setDetail] = useState(null);

    useEffect(() => {
        fetch(`https://www.swapi.tech/api/${type}/${uid}`)
            .then(res => res.json())
            .then(data => {
                if (data.result) setDetail(data.result.properties);
            })
            .catch(err => console.error("Error:", err));
    }, [type, uid]);

    if (!detail) return <div className="text-center mt-5"><div className="spinner-border text-warning"></div></div>;

    return (
        <div className="container mt-5 text-white">
            <div className="row bg-dark rounded p-4 border border-secondary">
                <div className="col-md-6 text-center">
                    <img 
                        src={`https://raw.githubusercontent.com/tbone849/star-wars-guide/master/build/assets/img/${type === "people" ? "characters" : type}/${uid}.jpg`}
                        className="img-fluid rounded shadow"
                        onError={(e) => e.target.src = "https://starwars-visualguide.com/assets/img/placeholder.jpg"}
                    />
                </div>
                <div className="col-md-6 d-flex flex-column justify-content-center">
                    <h1 className="display-4 fw-bold text-warning">{detail.name}</h1>
                    <p className="fs-5 text-secondary text-center">A story from a galaxy far, far away...</p>
                </div>
            </div>

            <hr className="border-danger border-2 my-5" />

            {/* TABLA DE DATOS TÉCNICOS */}
            <div className="row text-danger text-center fw-bold pb-5">
                {type === "people" && (
                    <>
                        <div className="col"><h5>Birth Year</h5><p className="text-white">{detail.birth_year}</p></div>
                        <div className="col"><h5>Gender</h5><p className="text-white">{detail.gender}</p></div>
                        <div className="col"><h5>Height</h5><p className="text-white">{detail.height}</p></div>
                        <div className="col"><h5>Skin Color</h5><p className="text-white">{detail.skin_color}</p></div>
                        <div className="col"><h5>Eye Color</h5><p className="text-white">{detail.eye_color}</p></div>
                    </>
                )}
                {type === "planets" && (
                    <>
                        <div className="col"><h5>Climate</h5><p className="text-white">{detail.climate}</p></div>
                        <div className="col"><h5>Population</h5><p className="text-white">{detail.population}</p></div>
                        <div className="col"><h5>Terrain</h5><p className="text-white">{detail.terrain}</p></div>
                        <div className="col"><h5>Diameter</h5><p className="text-white">{detail.diameter}</p></div>
                    </>
                )}
                {type === "vehicles" && (
                    <>
                        <div className="col"><h5>Model</h5><p className="text-white">{detail.model}</p></div>
                        <div className="col"><h5>Class</h5><p className="text-white">{detail.vehicle_class}</p></div>
                        <div className="col"><h5>Cost</h5><p className="text-white">{detail.cost_in_credits}</p></div>
                        <div className="col"><h5>Speed</h5><p className="text-white">{detail.max_atmosphering_speed}</p></div>
                    </>
                )}
            </div>
            <div className="text-center pb-5">
                <Link to="/" className="btn btn-warning btn-lg px-5">Back Home</Link>
            </div>
        </div>
    );
};