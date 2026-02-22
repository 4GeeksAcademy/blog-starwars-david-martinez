import React from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export const Layout = () => {
    return (
        <>
            <Navbar />
            {/* El Outlet es el que permite que se vea el Home o el Single */}
            <Outlet /> 
            <Footer />
        </>
    );
};