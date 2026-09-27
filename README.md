# Doctor Tracker Backend

## Description
Doctor Tracker Backend is a secure, high-performance RESTful API built with Node.js, Express, and MongoDB that powers the Doctor Tracker administrative portal. It provides robust endpoints for managing doctors and patients, handling authentication with JWTs, and aggregating database statistics for the frontend dashboard visualization.

## Setup Guide

Follow these steps to get the backend running locally.

1. **Clone the repository:**
   ```bash
   git clone <your-repository-url>
   cd doctor-tracker-backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file using the provided `.env.example`.

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```

## System Architecture

The backend follows a standalone service architecture designed entirely around RESTful API principles.
- **Controller-Service-Route Pattern:** The codebase is strictly organized into modules (Auth, Doctor, Patient, User). Each module isolates its routing, business logic (Services), request handling (Controllers), and database models.
- **Data Persistence:** MongoDB serves as the primary database, utilizing Mongoose ODM for schema definition and relationship mapping between Doctors and Patients.
- **Security Middleware:** All routes are protected by a custom `auth()` middleware that decodes incoming JWTs and enforces Admin-only role authorization based on the project specification.

## Technical Decisions

1. **Why we chose Zod for Validation over Mongoose Built-in Validation**
   While Mongoose can validate data right before it hits the database, relying solely on it means the application processes potentially malicious or malformed data through the entire controller and service layers first. By integrating **Zod** at the route level via a `validateRequest` middleware, we intercept and sanitize bad requests immediately, returning clean, standardized error messages to the frontend before any backend processing occurs.

2. **Why we strictly enforced the 'Admin' role across all routes**
   According to the project specification, the platform is described as an "administrative web application" where the "Admin can: Create a doctor... Add new patients". By stripping out unnecessary multi-role complexity (e.g., separate doctor or patient logins) and enforcing the `admin` role exclusively in the authentication middleware, we significantly optimized the security architecture and eliminated accidental authorization leaks.

## Visual Evidence

Since this is a backend API, visual evidence is represented via API interactions. You can test these endpoints using Postman or Thunder Client.

- **API Base URL:** `http://localhost:5000/api/v1`
- **Example Endpoint:** `GET /api/v1/doctors` (Requires Bearer Token)
