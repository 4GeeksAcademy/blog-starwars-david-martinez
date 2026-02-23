import React from "react";
import { Link } from "react-router-dom";
import useStore from "../hooks/useGlobalReducer";

export const Navbar = () => {
    // Traigo el store para ver los favoritos y el dispatch para poder borrarlos
    const { store, dispatch } = useStore();

    return (
        // Uso 'sticky-top' para que la barra siempre nos acompañe al hacer scroll
        <nav className="navbar navbar-dark bg-transparent mb-3 px-5 border-bottom border-secondary sticky-top">
            {/* LOGO: Envuelto en un Link para que al hacer clic siempre nos devuelva al inicio */}
            <Link to="/">
                <img src="https://upload.wikimedia.org/wikipedia/commons/6/6c/Star_Wars_Logo.svg" style={{ width: "100px" }} alt="logo" />
            </Link>

            {/* MENÚ DESPLEGABLE DE FAVORITOS */}
            <div className="dropdown">
                <button className="btn btn-primary dropdown-toggle d-flex align-items-center" type="button" data-bs-toggle="dropdown">
                    Favorites 
                    {/* Contador dinámico: muestra cuántos elementos hay en el array de favoritos */}
                    <span className="badge bg-warning text-dark ms-2">{store.favorites.length}</span>
                </button>

                <ul className="dropdown-menu dropdown-menu-end bg-dark border-secondary shadow" style={{ minWidth: "200px" }}>
                    {/* RENDERIZADO CONDICIONAL: Si no hay favoritos, muestro un mensaje vacío */}
                    {store.favorites.length === 0 ? (
                        <li className="dropdown-item text-white-50 text-center small">No favorites yet</li>
                    ) : (
                        // Si HAY favoritos, recorro el array y dibujo cada uno
                        store.favorites.map((fav, index) => (
                            <li key={index} className="dropdown-item d-flex justify-content-between align-items-center text-white py-2">
                                {/* 'text-truncate' evita que nombres muy largos deformen el menú */}
                                <span className="text-truncate" style={{ maxWidth: "150px" }}>{fav}</span>
                                
                                {/* ICONO DE PAPELERA: Para borrar el favorito directamente */}
                                <i className="fas fa-trash-alt ms-3 text-danger" style={{ cursor: "pointer" }} 
                                   onClick={(e) => { 
                                       // 'e.stopPropagation' es clave: evita que al borrar se cierre el menú solo
                                       e.stopPropagation(); 
                                       dispatch({ type: "delete_favorite", payload: fav }); 
                                   }}></i>
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </nav>
    );
};