import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./pages/Layout"; // Asegúrate: carpeta "pages" y "Layout" con L mayúscula
import { Home } from "./pages/Home";
import { Single } from "./pages/Single";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            { path: "/", element: <Home /> },
            { path: "single/:type/:uid", element: <Single /> },
        ],
    },
]);