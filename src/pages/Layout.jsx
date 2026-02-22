import React from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export const Layout = () => {
    return (
        <div className="layout-container" style={{ width: "100%" }}>
            
            {/* CAPA 0: VIDEO */}
            <div className="bg-video-container">
                <video autoPlay loop muted playsInline className="bg-video">
                    <source src="/fondo.mp4" type="video/mp4" />
                </video>
            </div>

            {/* CAPA 1: TODO EL CONTENIDO */}
            <div className="content-wrapper">
                <Navbar />
                <main>
                    <Outlet />
                </main>
                <Footer />
            </div>

        </div>
    );
};