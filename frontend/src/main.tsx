import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider, createBrowserRouter, redirect } from "react-router-dom";
import Welcome from "./views/Welcome";
import User from "./views/User";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Welcome />,
  },
  {
    path: "/user",
    element: <User />,
    loader: async () => {
      const token = sessionStorage.getItem("token");
      if (token === null) {
        return redirect("/");
      }
      return null;
    },
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
