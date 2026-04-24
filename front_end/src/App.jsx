import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from './Components/NavBar/NavBar';
import Footer from './Components/Footer/Footer';
import Home from './Components/HomePage/Home';  
import Resources from './Components/ResourceManagement/Resources';
import LoginPage from './userManagement/pages/LoginPage';
import AdminDashboard from './userManagement/pages/AdminDashboard';
import UserDashboard from './userManagement/pages/UserDashboard';
import UsersPage from './userManagement/pages/UsersPage';
import AdminLayout from './userManagement/pages/AdminLayout';
import NotificationsPage from './Components/NotificationService/NotificationPage';
import ResourceManagementDashboard from './Components/ResourceManagement/Dashnoard/ResourceManagerDashboard';
import AddResource from './Components/ResourceManagement/Dashnoard/AddResource';
import ResourcesList from "./Components/ResourceManagement/Dashnoard/ResourcesList";
import UpdateResource from "./Components/ResourceManagement/Dashnoard/UpdateResource";
import Services from './Components/Services/Services';
import Contact from './Components/Contact/Contact';

function App() {
  return (
    <div>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="resource-management" element={<ResourceManagementDashboard />} />
            <Route path="add-resource" element={<AddResource />} />
            <Route path="/admin/resources-list" element={<ResourcesList />} />
            <Route path="/admin/update-resource/:id" element={<UpdateResource />} />
          </Route>
          <Route path="/notifications" element={<NotificationsPage />} />
        </Routes>
        <Footer />
      </BrowserRouter>

    </div>
  );
}

export default App;