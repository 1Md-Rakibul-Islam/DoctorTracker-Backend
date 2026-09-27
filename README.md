# Doctor Tracker Backend

A secure and scalable RESTful API for the **Doctor Tracker** administrative platform, built with **Node.js, Express, TypeScript, MongoDB, and Mongoose**.

The backend provides authentication, doctor and patient management, dashboard statistics, validation, authorization, pagination, filtering, and search functionality for the Doctor Tracker frontend.

## 🌐 Live API

**Production API:**
https://doctor-tracker-backend-sandy.vercel.app/

**API Base URL:**

```text
https://doctor-tracker-backend-sandy.vercel.app/api/v1
```

---

## ✨ Features

- 🔐 JWT-based authentication
- 🔄 Access and refresh token support
- 👤 Admin-based authorization
- 👨‍⚕️ Doctor management
- 🏥 Patient management
- 👥 Doctor-patient relationship management
- 📊 Dashboard statistics and aggregation
- 🔎 Search and filtering
- 📄 Pagination
- 📅 Date-range filtering
- ✅ Request validation with Zod
- 🛡️ Centralized error handling
- 🍪 HTTP cookie support for refresh tokens
- 🌐 CORS configuration
- 🗄️ MongoDB database with Mongoose
- 🚀 Vercel deployment support

---

# 🛠️ Tech Stack

### Backend

- **Node.js**
- **Express.js**
- **TypeScript**
- **MongoDB**
- **Mongoose**

### Authentication & Security

- **JWT**
- **bcrypt**
- **Zod**
- **Cookie Parser**
- **CORS**

### Development & Deployment

- **ts-node-dev**
- **ESLint**
- **Vercel**

---

# 🚀 Setup Guide

Follow these steps to run the backend locally.

## 1. Clone the Repository

```bash
git clone <your-repository-url>
cd DoctorTracker-Backend
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Configure Environment Variables

Create a `.env` file in the root directory.

```env
NODE_ENV=development
PORT=5000

DATABASE_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/doctor-tracker

BCRYPT_SALT_ROUNDS=12

JWT_ACCESS_SECRET=your_jwt_access_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret

JWT_ACCESS_EXPIRES_IN=10d
JWT_REFRESH_EXPIRES_IN=365d
```

> Never commit your `.env` file or expose database credentials and JWT secrets publicly.

## 4. Run the Development Server

```bash
npm run dev
```

The server will start at:

```text
http://localhost:5000
```

API base URL:

```text
http://localhost:5000/api/v1
```

---

# 📜 Available Scripts

| Command         | Description                              |
| --------------- | ---------------------------------------- |
| `npm run dev`   | Start development server with hot reload |
| `npm run build` | Compile TypeScript                       |
| `npm run start` | Start the production server              |
| `npm run lint`  | Run ESLint                               |

---

# 📚 API Documentation

## Base URL

Local:

```text
http://localhost:5000/api/v1
```

Production:

```text
https://doctor-tracker-backend-sandy.vercel.app/api/v1
```

Protected endpoints require:

```http
Authorization: Bearer <access_token>
```

---

# 🔐 Authentication

## 1. Register Admin

Creates a new admin account.

**Method:** `POST`

**Endpoint:**

```text
/auth/register
```

**Access:** Public

### Request Body

```json
{
  "name": "Admin Name",
  "email": "admin@example.com",
  "password": "securepassword"
}
```

---

## 2. Login

Authenticates an admin user.

**Method:** `POST`

**Endpoint:**

```text
/auth/login
```

**Access:** Public

### Request Body

```json
{
  "email": "admin@example.com",
  "password": "securepassword"
}
```

### Response

Returns an access token and sets the refresh token through cookies.

---

## 3. Refresh Token

Generates a new access token using the refresh token.

**Method:** `POST`

**Endpoint:**

```text
/auth/refresh-token
```

**Access:** Authenticated

**Cookie Required:**

```text
refreshToken
```

---

# 📊 Dashboard

## Get Dashboard Statistics

Returns aggregated information used by the frontend dashboard and charts.

**Method:** `GET`

**Endpoint:**

```text
/dashboard/stats
```

**Access:** Admin

**Header:**

```http
Authorization: Bearer <access_token>
```

### Includes

- Total doctors
- Total patients
- Patient condition statistics
- Doctor specialization statistics
- Other aggregated dashboard data

---

# 🩺 Doctors

## 1. Create Doctor

Creates a new doctor.

**Method:** `POST`

**Endpoint:**

```text
/doctors
```

**Access:** Admin

### Request Body

```json
{
  "name": "Dr. John Doe",
  "specialization": "Cardiology",
  "hospital": "City General",
  "phone": "+1234567890",
  "email": "dr.john@example.com"
}
```

---

## 2. Get All Doctors

Returns a paginated list of doctors.

**Method:** `GET`

**Endpoint:**

```text
/doctors
```

**Access:** Admin

### Optional Query Parameters

| Parameter         | Type     | Description                                 |
| ----------------- | -------- | ------------------------------------------- |
| `page`            | number   | Page number                                 |
| `limit`           | number   | Number of records per page                  |
| `searchTerm`      | string   | Search by name, specialization, or hospital |
| `specialization`  | string   | Filter by specialization                    |
| `hospital`        | string   | Filter by hospital                          |
| `createdAt[$gte]` | ISO date | Minimum creation date                       |
| `createdAt[$lte]` | ISO date | Maximum creation date                       |

### Example

```text
GET /doctors?page=1&limit=10&searchTerm=cardiology
```

---

## 3. Get Single Doctor

Returns a specific doctor by ID.

**Method:** `GET`

**Endpoint:**

```text
/doctors/:id
```

**Access:** Admin

---

## 4. Update Doctor

Updates an existing doctor.

**Method:** `PATCH`

**Endpoint:**

```text
/doctors/:id
```

**Access:** Admin

### Request Body

Only the fields that need to be updated are required.

```json
{
  "phone": "+0987654321"
}
```

---

## 5. Delete Doctor

Deletes a doctor.

**Method:** `DELETE`

**Endpoint:**

```text
/doctors/:id
```

**Access:** Admin

> A doctor cannot be deleted while patients are still assigned to that doctor. In that situation, the API returns a `409 Conflict` response.

---

## 6. Get Patients Assigned to Doctor

Returns all patients assigned to a specific doctor.

**Method:** `GET`

**Endpoint:**

```text
/doctors/:id/patients
```

**Access:** Admin

### Optional Query Parameters

```text
page
limit
searchTerm
```

### Example

```text
GET /doctors/doctor_id/patients?page=1&limit=10&searchTerm=jane
```

---

## 7. Add Patient to Doctor

Creates a patient and assigns the patient to a specific doctor.

**Method:** `POST`

**Endpoint:**

```text
/doctors/:id/patients
```

**Access:** Admin

### Request Body

```json
{
  "name": "Jane Doe",
  "age": 45,
  "gender": "Female",
  "contact": "1231231234",
  "condition": "Stable",
  "address": "123 Street Ave"
}
```

---

## 8. Remove Patient from Doctor

Removes a patient assignment from a doctor.

**Method:** `DELETE`

**Endpoint:**

```text
/doctors/:id/patients/:patientId
```

**Access:** Admin

---

# 🏥 Patients

## 1. Create Patient

Creates a patient globally and optionally assigns the patient to a doctor.

**Method:** `POST`

**Endpoint:**

```text
/patients
```

**Access:** Admin

### Request Body

```json
{
  "name": "Jane Doe",
  "age": 45,
  "gender": "Female",
  "contact": "1231231234",
  "condition": "Critical",
  "address": "123 Street Ave",
  "doctorId": "651a2b3c4d5e6f7a8b9c0d1e"
}
```

---

## 2. Get All Patients

Returns a paginated list of patients.

**Method:** `GET`

**Endpoint:**

```text
/patients
```

**Access:** Admin

### Optional Query Parameters

| Parameter         | Type     | Description                |
| ----------------- | -------- | -------------------------- |
| `page`            | number   | Page number                |
| `limit`           | number   | Number of records per page |
| `searchTerm`      | string   | Search patients            |
| `condition`       | string   | Filter by condition        |
| `createdAt[$gte]` | ISO date | Minimum creation date      |
| `createdAt[$lte]` | ISO date | Maximum creation date      |

### Example

```text
GET /patients?page=1&limit=10&condition=Critical
```

---

## 3. Get Single Patient

Returns a specific patient by ID.

**Method:** `GET`

**Endpoint:**

```text
/patients/:id
```

**Access:** Admin

---

## 4. Update Patient

Updates an existing patient.

**Method:** `PATCH`

**Endpoint:**

```text
/patients/:id
```

**Access:** Admin

### Request Body

```json
{
  "condition": "Stable",
  "doctorId": "new_doctor_id"
}
```

---

## 5. Delete Patient

Deletes a patient globally.

**Method:** `DELETE`

**Endpoint:**

```text
/patients/:id
```

**Access:** Admin

---

# 🏗️ System Architecture

The backend follows a modular **Controller-Service-Route** architecture.

```text
Request
   │
   ▼
Routes
   │
   ▼
Validation Middleware
   │
   ▼
Authentication / Authorization
   │
   ▼
Controller
   │
   ▼
Service
   │
   ▼
Mongoose Model
   │
   ▼
MongoDB
```

## Project Structure

A simplified representation of the backend structure:

```text
src/
├── app/
│   ├── config/
│   ├── middlewares/
│   ├── modules/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── doctor/
│   │   ├── patient/
│   │   └── user/
│   └── routes/
│
├── app.ts
└── server.ts
```

Each module separates:

- Routes
- Controllers
- Services
- Models
- Validation schemas
- Types

This keeps the application modular and easier to maintain.

---

# 🔒 Authentication & Authorization

The API uses **JWT-based authentication**.

### Access Token

The access token is used to authenticate protected API requests.

```http
Authorization: Bearer <access_token>
```

### Refresh Token

The refresh token is used to generate a new access token and is handled through cookies.

### Authorization

Administrative endpoints require an authenticated user with the appropriate admin role.

---

# ✅ Request Validation

The backend uses **Zod** for request validation.

Validation is performed before requests reach the controller and service layers.

This provides:

- Early validation of malformed input
- Consistent validation errors
- Better API reliability
- Reduced unnecessary database operations
- Stronger type safety

Example validation flow:

```text
Client Request
      ↓
Zod Validation
      ↓
Authentication
      ↓
Controller
      ↓
Service
      ↓
Database
```

---

# 🛡️ Security

The backend implements several security mechanisms:

- JWT authentication
- Role-based authorization
- Password hashing with bcrypt
- Zod request validation
- HTTP-only cookie support for refresh tokens
- CORS configuration
- Centralized error handling
- Environment-based secret management

### Environment Variables

Sensitive values such as:

```text
DATABASE_URL
JWT_ACCESS_SECRET
JWT_REFRESH_SECRET
```

should always be stored in environment variables rather than committed to source control.

---

# 🧠 Technical Decisions

## Why Zod Instead of Only Mongoose Validation?

Mongoose provides database-level schema validation, but validating requests earlier prevents malformed data from traveling through the controller and service layers.

Using Zod at the request level allows the application to reject invalid input before unnecessary backend processing or database operations occur.

---

## Why Admin-Based Authorization?

Doctor Tracker is designed as an administrative platform where the administrator manages doctors and patients.

Instead of introducing unnecessary authentication roles for doctors and patients, the backend focuses authorization around the administrative workflow defined by the application requirements.

This keeps the authorization model simpler and easier to maintain.

---

# 🗄️ Database

The application uses **MongoDB** with **Mongoose ODM**.

MongoDB stores:

- Users
- Doctors
- Patients
- Doctor-patient relationships
- Other application data

Mongoose is responsible for:

- Schema definitions
- Data modeling
- Database queries
- Relationships
- Validation
- Aggregation

---

# 🔎 Search, Filtering & Pagination

Doctor and patient endpoints support flexible data retrieval.

### Pagination

```text
?page=1&limit=10
```

### Search

```text
?searchTerm=john
```

### Filtering

```text
?condition=Critical
```

### Date Range

```text
?createdAt[$gte]=2026-01-01&createdAt[$lte]=2026-12-31
```

These features allow the frontend to efficiently retrieve large datasets without requesting every record at once.

---

# 🧪 API Testing

Since this is a backend API, endpoints can be tested using:

- Postman
- Thunder Client
- Insomnia
- Frontend application

### Example

```http
GET /api/v1/doctors
```

with:

```http
Authorization: Bearer <access_token>
```

### Health Check

```http
GET /
```

Expected response:

```json
{
  "status": 200,
  "data": {
    "name": "Doctor Tracker - server running",
    "version": "1.0.0"
  },
  "message": "success"
}
```

---

# 🚀 Deployment

The backend is deployed on **Vercel**.

### Production URL

```text
https://doctor-tracker-backend-sandy.vercel.app/
```

### Production API

```text
https://doctor-tracker-backend-sandy.vercel.app/api/v1
```

For production deployment, configure the required environment variables in the hosting platform.

---

# 📌 Important Notes

- MongoDB Atlas must allow connections from the deployed backend environment.
- Production environment variables must be configured separately from local `.env` files.
- Never expose MongoDB credentials or JWT secrets in GitHub.
- The frontend must use the production API URL after deployment.
- Protected API requests must include a valid access token.

---

# 👨‍💻 Author

**Rakibul Islam**

Built as part of the **Doctor Tracker** full-stack application.

---

## 📄 License

This project is developed for educational and project demonstration purposes.
