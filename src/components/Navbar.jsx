import React from "react";
import { Link } from "react-router-dom";
import useStore from "../hooks/useGlobalReducer";

export const Navbar = () => {
    const { store, dispatch } = useStore();

    return (
        <nav className="navbar navbar-dark bg-transparent mb-3 px-5 border-bottom border-secondary sticky-top">
            <Link to="/">
                <img src="https://upload.wikimedia.org/wikipedia/commons/6/6c/Star_Wars_Logo.svg" style={{ width: "100px" }} alt="logo" />
            </Link>
            <div className="dropdown">
                <button className="btn btn-primary dropdown-toggle d-flex align-items-center" type="button" data-bs-toggle="dropdown">
                    Favorites <span className="badge bg-warning text-dark ms-2">{store.favorites.length}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end bg-dark border-secondary shadow" style={{ minWidth: "200px" }}>
                    {store.favorites.length === 0 ? (
                        <li className="dropdown-item text-white-50 text-center small">No favorites yet</li>
                    ) : (
                        store.favorites.map((fav, index) => (
                            <li key={index} className="dropdown-item d-flex justify-content-between align-items-center text-white py-2">
                                <span className="text-truncate" style={{ maxWidth: "150px" }}>{fav}</span>
                                <i className="fas fa-trash-alt ms-3 text-danger" style={{ cursor: "pointer" }} 
                                   onClick={(e) => { e.stopPropagation(); dispatch({ type: "delete_favorite", payload: fav }); }}></i>
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </nav>
    );
};