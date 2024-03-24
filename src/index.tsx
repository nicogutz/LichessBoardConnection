import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';
import Landing from './pages/Landing';

const router = createBrowserRouter([
  {
    path: "/LichessBoardConnection",
    element: <Landing />,
  },

]);
ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
