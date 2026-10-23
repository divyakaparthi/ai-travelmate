import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyTrips from "./pages/MyTrips";
import Places from "./pages/Places";
import TripDetails from "./pages/TripDetails";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Landing Page */}
        <Route
          path="/"
          element={<Landing />}
        />

        {/* Authentication */}
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* Main Application */}
        <Route
          path="/home"
          element={<Home />}
        />

        <Route
          path="/my-trips"
          element={<MyTrips />}
        />

        <Route
          path="/places"
          element={<Places />}
        />

        {/* Trip Details */}
        <Route
          path="/trips/:id"
          element={<TripDetails />}
        />

      </Routes>
    </BrowserRouter>
  );
}