import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./pages/Layout"; 
import { Home } from "./pages/Home";
import { Single } from "./pages/Single";

// ESTE ES EL MAPA DE MI APLICACIÓN
export const router = createBrowserRouter([
    {
        // 1. RUTA PADRE: El Layout es el contenedor principal.
        // Todo lo que esté dentro de 'children' se renderizará en el <Outlet /> del Layout.
        path: "/",
        element: <Layout />,
        children: [
            { 
                // 2. PÁGINA DE INICIO: Cuando la URL sea exactamente "/", cargo el Home.
                path: "/", 
                element: <Home /> 
            },
            { 
                // 3. RUTA DINÁMICA: Esta es la parte más flexible.
                // Uso ":type" para saber si es un personaje o planeta.
                // Uso ":uid" para saber el ID específico.
                // Así, un solo componente (Single) sirve para miles de páginas diferentes.
                path: "single/:type/:uid", 
                element: <Single /> 
            },
        ],
    },
]);