import React from "react";
import logo from "./logo.svg";
import "./App.scss";
import { ToastContainer } from "react-toastify";
import { CommonWrapper, SpinnerComponent } from "components";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "routes";
import { userRoutes } from "routes/Routing";
import { TOAST_TIME } from "config";

function App() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Routes>
        {userRoutes.map((route, index) => (
          <Route
            path={route.path}
            key={index}
            element={
              <ProtectedRoute
                routeName={route.name}
                component={route.component}
                protectedRoute={route.group === "protected"}
              />
            }
          />
        ))}
      </Routes>

      <SpinnerComponent />
      <ToastContainer
        position="top-right"
        autoClose={TOAST_TIME}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </BrowserRouter>
  );
}

export default App;
