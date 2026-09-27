# Doctor Tracker Backend

A robust RESTful API backend for the Doctor Tracker application. This service is built with Node.js, Express, TypeScript, and MongoDB to manage doctors, patients, user authentication, and administrative dashboard statistics.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Server](#running-the-server)
- [API Documentation](#api-documentation)
  - [Authentication](#authentication)
  - [Doctors](#doctors)
  - [Patients](#patients)
  - [Users](#users)
  - [Dashboard](#dashboard)

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB (via Mongoose)
- **Validation:** Zod
- **Authentication:** JWT (JSON Web Tokens) with Access & Refresh tokens
- **Security:** bcrypt (password hashing), cookie-parser

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v18 or higher)
- npm or yarn
- A running instance of MongoDB (Local or MongoDB Atlas)

## Installation

1. **Clone the repository** (if you haven't already):

   ```bash
   git clone <your-repository-url>
   cd doctor-tracker-backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

## Environment Variables

Create a `.env` file in the root directory of the backend project and add the following variables:

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/doctor_tracker?retryWrites=true&w=majority

# Authentication
BCRYPT_SALT_ROUNDS=10
JWT_ACCESS_SECRET=your_jwt_access_secret_key
JWT_ACCESS_EXPIRES_IN=1d
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
JWT_REFRESH_EXPIRES_IN=30d
```

_Note: Ensure your MongoDB Atlas Network Access is configured to allow your IP, or `0.0.0.0/0` if deploying to Vercel/Render._

## Running the Server

### Development Mode

To run the server with hot-reloading (using `ts-node-dev` or similar):

```bash
npm run dev
```

The server will start on `http://localhost:5000` (or the PORT defined in your `.env`).

### Production Mode

To build and run the compiled TypeScript code:

```bash
npm run build
npm start
```

---

## API Documentation

The base URL for all API endpoints is: `/api/v1`

### Authentication

Endpoints for user registration, login, and token refresh.

| Method | Endpoint              | Description                                          | Auth Required |
| ------ | --------------------- | ---------------------------------------------------- | ------------- |
| `POST` | `/auth/register`      | Register a new user                                  | No            |
| `POST` | `/auth/login`         | Login and receive access/refresh tokens              | No            |
| `POST` | `/auth/refresh-token` | Issue new access token using HttpOnly refresh cookie | No            |

### Doctors

Endpoints for managing doctors and assigning patients.

| Method   | Endpoint                           | Description                                       | Auth Required     |
| -------- | ---------------------------------- | ------------------------------------------------- | ----------------- |
| `POST`   | `/doctors`                         | Create a new doctor                               | `admin`           |
| `GET`    | `/doctors`                         | Get all doctors (supports pagination & filtering) | `admin`, `doctor` |
| `GET`    | `/doctors/:id`                     | Get a specific doctor by ID                       | `admin`, `doctor` |
| `PATCH`  | `/doctors/:id`                     | Update doctor details                             | `admin`           |
| `DELETE` | `/doctors/:id`                     | Delete a doctor                                   | `admin`           |
| `GET`    | `/doctors/:id/patients`            | Get all patients assigned to a doctor             | `admin`, `doctor` |
| `POST`   | `/doctors/:id/patients`            | Assign a new patient to a doctor                  | `admin`, `doctor` |
| `DELETE` | `/doctors/:id/patients/:patientId` | Remove a patient from a doctor                    | `admin`, `doctor` |

### Patients

Endpoints for global patient management.

| Method   | Endpoint        | Description                                        | Auth Required     |
| -------- | --------------- | -------------------------------------------------- | ----------------- |
| `POST`   | `/patients`     | Create a new patient                               | `admin`, `doctor` |
| `GET`    | `/patients`     | Get all patients (supports pagination & filtering) | Yes               |
| `GET`    | `/patients/:id` | Get a specific patient by ID                       | Yes               |
| `PATCH`  | `/patients/:id` | Update patient details                             | `admin`, `doctor` |
| `DELETE` | `/patients/:id` | Delete a patient                                   | `admin`, `doctor` |

### Users

Endpoints for system user management.

| Method | Endpoint | Description                     | Auth Required |
| ------ | -------- | ------------------------------- | ------------- |
| `POST` | `/users` | Create a new user (admin route) | `admin`       |
| `GET`  | `/users` | Get all users                   | `admin`       |

### Dashboard

Endpoints for retrieving administrative statistics.

| Method | Endpoint           | Description                                    | Auth Required     |
| ------ | ------------------ | ---------------------------------------------- | ----------------- |
| `GET`  | `/dashboard/stats` | Get aggregate counts (doctors, patients, etc.) | `admin`, `doctor` |

---

_Built with ❤️ for Doctor Tracker._
