import React from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export const Layout = () => {
    return (
        <div className="layout-container" style={{ width: "100%" }}>
            
            {/* CAPA 0: VIDEO DE FONDO */}
            {/* Pongo el video aquí afuera para que "viva" en todo el proyecto. 
                Al estar en el Layout, el video no se corta ni se reinicia cuando 
                cambiamos de página (por ejemplo, del Home al Single). */}
            <div className="bg-video-container">
                <video autoPlay loop muted playsInline className="bg-video">
                    <source src="/fondo.mp4" type="video/mp4" />
                </video>
            </div>

            {/* CAPA 1: TODO EL CONTENIDO FLOTANDO ENCIMA */}
            <div className="content-wrapper">
                {/* La Navbar siempre se queda arriba en todas las vistas */}
                <Navbar />
                
                <main>
                    {/* El Outlet es la pieza más importante del Router: 
                        Es el "hueco" donde se van a intercambiar el Home y el Single 
                        dependiendo de la URL en la que estemos. */}
                    <Outlet />
                </main>
                
                {/* El Footer siempre se queda al final */}
                <Footer />
            </div>

        </div>
    );
};