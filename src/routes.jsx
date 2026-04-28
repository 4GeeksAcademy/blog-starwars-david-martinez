import { createBrowserRouter } from "react-router-dom";
import { Home } from "./pages/Home";
import { Single } from "./pages/Single";
import { Layout } from "./pages/Layout";


export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                // Ruta corregida según el feedback 
                path: "/:type/:uid",
                element: <Single />,
            },
            {
                // Página de error 404 por si el usuario escribe una ruta inexistente
                path: "*",
                element: (
                    <div className="text-center text-white mt-5">
                        <h1>404 - Not Found</h1>
                        <p>This is not the page you are looking for...</p>
                    </div>
                ),
            },
        ],
    },
]);