import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider, createBrowserRouter, redirect } from "react-router-dom";
import Welcome from "./views/Welcome";
import User from "./views/User";
import About from "./views/About";
import { useCombinedStore } from "./store/combinedStore";
import Graph from "./views/Graph";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Welcome />,
    loader: async () => {
      if (import.meta.env.DEV) {
        // skip validation for dev purpose
        return null;
      }
      const token = useCombinedStore.getState().token;
      // skip login if user is already logged in
      if (token !== "") {
        return redirect("/user");
      }
      return null;
    },
  },
  {
    path: "/user",
    element: <User />,
    loader: async () => {
      if (import.meta.env.DEV) {
        // skip validation for dev purpose
        return null;
      }
      const token = useCombinedStore.getState().token;
      if (token === "") {
        return redirect("/");
      }
      return null;
    },
  },
  {
    path: "/graph",
    element: <Graph />,
  },
  {
    path: "/about",
    element: <About />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
