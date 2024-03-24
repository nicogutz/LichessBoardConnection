import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';
import Landing from './pages/Landing';
import Play from './pages/Play';

const router = createBrowserRouter([
  {
    path: "LichessBoardConnection",
    children: [
      {
        path: "",
        element: <Landing /> ,
      },
      {
        path: "play",
        element: <Play />
      }
    ]
  },
]);
ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement).render(
    // Disable to get banned less from lichess api, sends 1 request instead of 2.
    // <React.StrictMode> 
      <RouterProvider router={router} />
    // </React.StrictMode>
  );
