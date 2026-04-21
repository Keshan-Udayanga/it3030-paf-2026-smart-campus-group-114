import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from './Components/NavBar/NavBar';
import Footer from './Components/Footer/Footer';
import Home from './Components/HomePage/Home';  
import Resources from './Components/ResourceManagement/Resources';
import TicketForm from './Components/TicketManagement/TicketForm';

function App() {
  return (
    <div>
      <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/tickets" element={<TicketForm />} />
      </Routes>
      <Footer />
      </BrowserRouter>
      
    </div>
  );
}

export default App;