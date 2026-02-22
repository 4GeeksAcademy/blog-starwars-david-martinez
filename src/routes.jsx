import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./pages/Layout"; // Corregido: apunta a la carpeta pages y usa L mayúscula
import { Home } from "./pages/Home";
import { Single } from "./pages/Single";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                // Esta es la ruta que ya te está funcionando para los detalles
                path: "single/:type/:uid", 
                element: <Single />,
            },
        ],
    },
]);