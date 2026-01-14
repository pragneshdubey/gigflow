import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Gigs/Dashboard";
import GigsPage from "./pages/Gigs/GigsPage";
import GigDetails from "./pages/Gigs/GigDetails";
import CreateGig from "./pages/Gigs/CreateGig";
import EditGig from "./pages/Gigs/EditGig";

export default function App() {
  return (
    <Routes>
      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Gigs */}
      <Route path="/" element={<Dashboard />} />
      <Route path="/gigs" element={<GigsPage />} />
      <Route path="/gigs/:id" element={<GigDetails />} />
      <Route path="/gigs/create" element={<CreateGig />} />
      <Route path="/gigs/edit/:id" element={<EditGig />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}
