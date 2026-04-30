import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import NavBar from './Components/NavBar/NavBar';
import Footer from './Components/Footer/Footer';

import Home from './Components/HomePage/Home';
import Resources from './Components/ResourceManagement/Resources';
import Services from "./Components/Services/Services";
import Contact from "./Components/Contact/Contact";

import LoginPage from "./userManagement/pages/LoginPage";
import AdminDashboard from "./userManagement/pages/AdminDashboard";
import UserDashboard from "./userManagement/pages/UserDashboard";
import UsersPage from "./userManagement/pages/UsersPage";
import AdminLayout from "./userManagement/pages/AdminLayout";
import NotificationsPage from "./Components/NotificationService/NotificationPage";

import ResourceManagementDashboard from "./Components/ResourceManagement/Dashnoard/ResourceManagerDashboard";
import AddResource from "./Components/ResourceManagement/Dashnoard/AddResource";
import ResourcesList from "./Components/ResourceManagement/Dashnoard/ResourcesList";
import UpdateResource from "./Components/ResourceManagement/Dashnoard/UpdateResource";


import BookingForm from "./Components/BookingManagement/BookingForm";
import AdminBookings from "./Components/BookingManagement/AdminBookings";
import MyBookings from "./Components/BookingManagement/MyBookings";
import Summary from "./Components/BookingManagement/Summary";


import TicketForm from './Components/TicketManagement/TicketForm';
import TicketList from "./Components/TicketManagement/TicketList";
import MyTickets from "./Components/TicketManagement/MyTickets";
import TicketDetails from "./Components/TicketManagement/TicketDetails";

function App() {
  return (
    <div>
      <BrowserRouter>
        <NavBar />
        <Routes>
          {/* 🌐 Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/booking/:id" element={<BookingForm />} />

          <Route path="/tickets" element={<MyTickets />} />
          <Route path="/tickets/:id" element={<TicketDetails />} />
          <Route path="/tickets/create" element={<TicketForm />} />
          
          <Route path="/myBookings" element={<MyBookings />} />

          {/* 🛡️ Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>

            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<UsersPage />} />

            <Route path="resource-management" element={<ResourceManagementDashboard />} />

            <Route path="add-resource" element={<AddResource />} />
            <Route path="resources-list" element={<ResourcesList />} />
            <Route path="update-resource/:id" element={<UpdateResource />} />

            <Route path="booking-management" element={< AdminBookings />} />
            <Route path="booking-summary" element={< Summary />} />

            <Route path="tickets" element={<TicketList />} />

          </Route>
        </Routes>
        <Footer />
      </BrowserRouter>

    </div>
  );
}

export default App;