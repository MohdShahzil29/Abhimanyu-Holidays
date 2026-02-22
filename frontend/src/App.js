import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Toaster } from "./components/ui/sonner";
import Home from "./pages/Home";
import About from "./pages/About";
import OneDayTours from "./pages/OneDayTours";
import TourDetail from "./pages/TourDetail";
import TourPackages from "./pages/TourPackages";
import PackageDetail from "./pages/PackageDetail";
import TaxiServices from "./pages/TaxiServices";
import Hotels from "./pages/Hotels";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/one-day-tours" element={<OneDayTours />} />
          <Route path="/one-day-tours/:id" element={<TourDetail />} />
          <Route path="/tour-packages" element={<TourPackages />} />
          <Route path="/tour-packages/:id" element={<PackageDetail />} />
          <Route path="/taxi-services" element={<TaxiServices />} />
          <Route path="/hotels" element={<Hotels />} />
          <Route path="/hotels/:id" element={<Hotels />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
        <Footer />
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;
