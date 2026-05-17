# API Documentation - Task Management System

## Base URL

```bash
http://localhost:5000/api
```

---

# Authentication APIs

## 1. Register User

### Endpoint

```bash
POST /auth/register
```

### Request Body

```json
{
  "name": "Abhishek Kumar",
  "email": "abhishek@gmail.com",
  "password": "123456"
}
```

### Success Response

```json
{
  "message": "User registered successfully",
  "token": "jwt_token"
}
```

---

## 2. Login User

### Endpoint

```bash
POST /auth/login
```

### Request Body

```json
{
  "email": "abhishek@gmail.com",
  "password": "123456"
}
```

### Success Response

```json
{
  "message": "Login successful",
  "token": "jwt_token"
}
```

---

# Task APIs

## 3. Get All Tasks

### Endpoint

```bash
GET /tasks
```

### Headers

```bash
Authorization: Bearer <token>
```

---

## 4. Create Task

### Endpoint

```bash
POST /tasks
```

### Request Body

```json
{
  "title": "Complete Project",
  "description": "Finish frontend module",
  "status": "Pending"
}
```

---

## 5. Update Task

### Endpoint

```bash
PUT /tasks/:id
```

### Request Body

```json
{
  "status": "Completed"
}
```

---

## 6. Delete Task

### Endpoint

```bash
DELETE /tasks/:id
```

---

# File Upload API

## 7. Upload File

### Endpoint

```bash
POST /upload
```

### Headers

```bash
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

---

# Status Codes

| Code | Meaning |
|------|----------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 500 | Server Error |

---

# Swagger Setup

Install Swagger:

```bash
npm install swagger-ui-express swagger-jsdoc
```

Example Setup:

```js
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Task Management API',
      version: '1.0.0',
    },
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsDoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
```

Swagger URL:

```bash
http://localhost:5000/api-docs
```

---

# Postman Collection

Import:

```bash
Task-Management-System.postman_collection.json
```

into Postman for API testing.

---

# Author

Abhishek Kumar  
B.Tech Mathematics and Computing 
iiit bhagalpur
roll--230104001