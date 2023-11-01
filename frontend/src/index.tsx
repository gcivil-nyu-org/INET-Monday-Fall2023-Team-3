import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Welcome from "views/Welcome";
import reportWebVitals from "./reportWebVitals";

import { createBrowserRouter, redirect, RouterProvider } from "react-router-dom";
import User from "views/User";
import Graph from "views/Graph";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Welcome />,
  },
  {
    path: "/user",
    element: <User />,
    loader: async () => {
      const currToken = sessionStorage.getItem("token") ?? "";
      if (currToken === "" && process.env.APP_DEBUG === "false") {
        return redirect("/");
      }
      return null;
    },
  },
  {
    path: "/graph",
    element: <Graph />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
