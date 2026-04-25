import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from './Components/NavBar/NavBar';
import Footer from './Components/Footer/Footer';
import Home from './Components/HomePage/Home';
import Resources from './Components/ResourceManagement/Resources';
import TicketForm from './Components/TicketManagement/TicketForm';
import TicketList from "./Components/TicketManagement/TicketList";

function App() {
  return (
    <div>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/tickets" element={<TicketForm />} />
          <Route path="/tickets/list" element={<TicketList />} />
        </Routes>
        <Footer />
      </BrowserRouter>

    </div>
  );
}

export default App;