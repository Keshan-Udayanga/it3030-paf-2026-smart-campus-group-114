# Smart Campus Operations Hub

Smart Campus Operations Hub is a full-stack web application built using **Spring Boot** and **React** to manage campus resources, bookings, and related operations in an efficient and user-friendly way.

---

## About the Project

This system helps manage campus facilities such as lecture halls, labs, and equipment. It allows users to view and book resources while administrators can manage resources and monitor their usage.

The main goal of this project is to simplify resource management and avoid conflicts like double booking.

---

## Key Features

### 🔹 Resource Management

* Add and manage resources such as lecture halls, labs, and meeting rooms
* View resource details like capacity, location, and status

### 🔹 Resource Booking

* Book resources easily through the system
* View existing bookings
* Prevent double booking using smart validation

### Time-Based Availability (Special Feature)

* Users can select a specific time range
* The system shows only resources available during that time
* Uses a time overlap checking mechanism to avoid booking conflicts

### 🔹 Search & Filtering

* Search resources by name or type
* Filter resources based on availability and selected time

### 🔹 Dashboard

* View total resources
* View active and inactive resources
* Quick access to resource management features

### 🔹 Authentication & Authorization

* Secure login using JWT (JSON Web Tokens)
* Role-based access control (Admin and User)

---

## Technologies Used

### Frontend

* React.js
* Axios (for API calls)
* React Router (for navigation)
* CSS for styling

### Backend

* Spring Boot
* RESTful API architecture
* Spring Data MongoDB
* JWT Authentication

### Database

* MongoDB

---

## System Architecture

The system follows a layered architecture:

Controller → Service → Repository → Database

* Controller handles HTTP requests
* Service contains business logic
* Repository interacts with the database
* DTOs and Mappers are used to transfer and convert data

---

## How the System Works

1. The user interacts with the frontend (React UI)
2. The frontend sends requests to the backend using REST APIs
3. The backend processes the request through controller, service, and repository layers
4. Data is stored/retrieved from the database
5. The response is sent back and displayed on the UI

---

## Security

* JWT-based authentication is used
* Tokens are stored in local storage
* Only authorized users can access protected features
* Role-based permissions are applied

---

## How to Run the Project

### Backend (Spring Boot)

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### Frontend (React)

```bash
cd frontend
npm install
npm start
```

---

## 🌐 API Base URL

http://localhost:8080/api

---

## Example API Endpoints

* GET /api/resources → Get all resources
* POST /api/resources/add → Add new resource
* GET /api/bookings → Get bookings
* POST /api/bookings → Create booking

---

## Key Concepts Used

* REST API design
* Time conflict detection (to prevent double booking)
* DTO, Entity, and Mapper pattern
* Global exception handling
* Authentication and Authorization

---

## Future Improvements

* Add real-time notifications
* Improve UI/UX design
* Add mobile app support
* Advanced reporting and analytics

---

## Project Information

This project was developed as part of the **IT3030 PAF Assignment**.

---

## Note

This project is developed for educational purposes.
