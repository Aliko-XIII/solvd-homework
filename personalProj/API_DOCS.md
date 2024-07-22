# API Documentation

## Description
This project is a hospital appointments app. The application has the following functionality: add, update, delete, and get information about appointments, patients, doctors, their specializations, symptoms, and organs they work with. App supports authorization using JWT.

## Technical Requirements
- **Programming Language**: JavaScript
- **Backend Framework**: Express.js
- **Frontend Framework**: React.js
- **Database**: PostgreSQL
- **Containerization**: Docker

## Base URL
`http://localhost:3000`

## API Endpoints

### 1. Endpoint `api/users/`:

***
#### GET `api/users`
**Purpose:** Get all users.

**Request headers:**

<table border=3>
<tr>
  <th style="width:20%;">Header name</th>
  <th>Header value</th>
  </tr>

  <tr>
  <td>Authorization</th>
  <td>Access token generated for user.</td>
  </tr>
</table>

**Request body:**

Empty

**Responses:**

<table border=3>
<tr>
  <th style="width:20%;">Status code</th>
  <th>Response</th>
  </tr>

  <tr>
  <td>200</th>
  <td>Returns all user records, which include id, phone, first name, last name, age and sex.</td>
  </tr>
</table>

**Query Parameters**:

<table border=3>
  <tr>
    <th style="width: 10%;">
    Parameter name</th>
    <th style="width: 10%;">
    Patameter type</th>
    <th style="width: 60%;">
    Parameter description</th>
  </tr>
  <tr>
    <td><b>firstName</b></td>
    <td>string</td>
    <td>part of users' first name</td>
  </tr>
  <tr>
    <td><b>lastName</b></td>
    <td>string</td>
    <td>part of users' last name</td>
  </tr>
  <tr>
    <td><b>minAge</b></td>
    <td>integer</td>
    <td>bottom border for users' age</td>
  </tr>
  <tr>
    <td><b>maxAge</b></td>
    <td>integer</td>
    <td>top border for users' age</td>
  </tr>
  <tr>
    <td><b>sex</b></td>
    <td>string</td>
    <td>user's sex</td>
  </tr>
  <tr>
    <td><b>phone</b></td>
    <td>string</td>
    <td>part of users' phone number</td>
  </tr>
</table>

***Example 1***

**Request**
```sh
    curl -X 'GET' \
    'api/users' \
    -H 'Authorization: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMjN9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
```

**Response body**
```sh
    [{
        "id": "d9b1d7e3-f9c2-4efc-a5b0-33ed95b47226",
        "phone": "+1-555-123-4567",
        "firstName": "Alice",
        "lastName": "Johnson",
        "age": 26,
        "sex": "F",
    },
    {
        "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
        "phone": "+1-555-456-7890",
        "firstName": "Bob",
        "lastName": "Smith",
        "age": 30,
        "sex": "M"
    }
    ]
```

***Example 2***

**Request**
```sh
    curl -X 'GET' \
    'api/users/?firstName=Br' \
    -H 'Authorization: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMjN9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
```
   ​
**Response body**
```sh
    [
    {
        "id": "e7e5a26d-b46b-4a1b-8f83-c2a09a7f2c58",
        "firstName": "Bruce",
        "lastName": "Wayne",
        "age": 26,
        "sex": "M",
        "phone": "+1-555-123-4567"
    },
    {
        "id": "4d94f28e-3ef4-4d22-a234-0f8c7c13b749",
        "firstName": "Brian",
        "lastName": "Banner",
        "age": 19,
        "sex": "M",
        "phone": "+1-555-234-5678"
    }
    ]
```
***
#### GET `api/users/{userId}`
**Purpose:** Get a user by ID. 

**Request headers:**

<table border=3>
<tr>
  <th style="width:20%;">Header name</th>
  <th>Header value</th>
  </tr>

  <tr>
  <td>Authorization</th>
  <td>Access token generated for user.</td>
  </tr>
</table>

**Request body:**

Empty

**Responses:**

<table border=3>
    <tr>
  <th style="width:20%;">Status code</th>
  <th>Response</th>
  </tr>

  <tr>
  <td>200</th>
  <td>Returns one user record, which includes id, phone, first name, last name, age and sex.</td>
  </tr>

  <tr>
  <td>404</th>
  <td>There is no such user found.</td>
  </tr>
</table>

***Example***

**Request**
```sh
    curl -X 'GET' \
    'api/users/8a9e4d28-fb9b-4f80-b25c-7b93e8c1c1e4' \
    -H 'Authorization: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMjN9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
```

**Response body**
```sh
    {
    "id": "8a9e4d28-fb9b-4f80-b25c-7b93e8c1c1e4",
    "firstName": "Liam",
    "lastName": "O'Connor",
    "age": 34,
    "sex": "M",
    "phone": "+1-555-567-8901"
    }
```

***
#### POST `api/users` 

**Purpose:** Create new user record and put it to the DB.

**Request headers:**

<table border=3>
<tr>
  <th style="width:20%;">Header name</th>
  <th>Header value</th>
  </tr>

  <tr>
  <td>Authorization</th>
  <td>Access token generated for user.</td>
  </tr>
</table>

**Request body:**

User object with first name, last name, age, sex, password.

**Responses:**

<table border=3>
    <tr>
  <th style="width:20%;">Status code</th>
  <th>Response</th>
  </tr>

  <tr>
  <td>201</th>
  <td>New user created and their record with ID is returned.</td>
  </tr>

  <tr>
  <td>400</th>
  <td>User object misses fields or their data is invalid.</td>
  </tr>

  <tr>
  <td>409</th>
  <td>There is already a user with such a phone number.</td>
  </tr>
</table>

***Example***

**Request**
```sh
    curl -X 'POST' \
    'api/users' \
    -H 'Authorization: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMjN9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
    -H 'Content-Type: application/json' \
    -d '{
        "firstName": "Sophia",
        "lastName": "Lee",
        "age": 19,
        "sex": "F",
        "password": "password789",
        "phone": "+1-555-678-9012"
    }'
```

**Response body**
```sh
    {
        "id": "e6b7b6d5-8e54-4f56-9d8e-3b8a1c64e5c3",
    }
```

***
#### PUT `api/users/{userId}` 

**Purpose:** Update record about a user in the DB.

**Request headers:**

<table border=3>
<tr>
  <th style="width:20%;">Header name</th>
  <th>Header value</th>
  </tr>

  <tr>
  <td>Authorization</th>
  <td>Access token generated for user.</td>
  </tr>
</table>

**Request body:**

Object with user's ID and updated information needed for a user.

**Responses:**

<table border=3>
    <tr>
  <th style="width:20%;">Status code</th>
  <th>Response</th>
  </tr>

  <tr>
  <td>200</th>
  <td>User is updated and their updated record is returned.</td>
  </tr>

  <tr>
  <td>204</th>
  <td>ID is valid, but there is no data in request body to update.</td>

  <tr>
  <td>400</th>
  <td>Some of updated data is invalid.</td>
  </tr>

  <tr>
  <td>404</th>
  <td>User with specified ID was not found.</td>
  </tr>

  <tr>
  <td>409</th>
  <td>Unique phone number constraint is violated.</td>
  </tr>
</table>

***Example***

**Request**
```sh
    curl -X 'PUT' \
    'api/users/a1c2e3d4-5f67-8a9b-0cde-1f23456789ab' \
    -H 'Authorization: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMjN9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
    -H 'Content-Type: application/json' \
    -d '{
        "id": "a1c2e3d4-5f67-8a9b-0cde-1f23456789ab",
        "firstName": "Jackson",
    }'
```

**Response body**
```sh
    {
        "id": "a1c2e3d4-5f67-8a9b-0cde-1f23456789ab",
        "firstName": "Jackson",
        "lastName": "Smith",
        "age": 22,
        "sex": "M",
        "phone": "+1-555-789-0123"
    }
```

***
#### DELETE `api/users/{userId}` 

**Purpose:** Delete record about a user from the DB.

**Request headers:**

<table border=3>
<tr>
  <th style="width:20%;">Header name</th>
  <th>Header value</th>
  </tr>

  <tr>
  <td>Authorization</th>
  <td>Access token generated for user.</td>
  </tr>
</table>

**Request body:**

Empty

**Responses:**

<table border=3>
    <tr>
  <th style="width:20%;">Status code</th>
  <th>Response</th>
  </tr>

  <tr>
  <td>204</th>
  <td>User is deleted, nothing is returned.</td>
  </tr>

  <tr>
  <td>404</th>
  <td>User with specified ID was not found.</td>
  </tr>
</table>

***Example***

**Request**
```sh
    curl -X 'DELETE' \
    'api/users/b3d4e5f6-7a8b-9c0d-1e2f-3g456h789i0j' \
    -H 'Authorization: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMjN9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
```

**Response body**
```sh
    Empty
```

### 3. Endpoint `api/patients/`:

***
#### GET `api/patients`

**Purpose:** Get all patients.

**Request headers:**

<table border=3>
<tr>
  <th style="width:20%;">Header name</th>
  <th>Header value</th>
  </tr>

  <tr>
  <td>Authorization</th>
  <td>Access token generated for user.</td>
  </tr>
</table>

**Request body:**

Empty

**Responses:**

<table border=3>
<tr>
  <th style="width:20%;">Status code</th>
  <th>Response</th>
  </tr>

  <tr>
  <td>200</th>
  <td>Returns all patient records, which include user or their id, insurance number and provider name.</td>
  </tr>

</table>

**Query Parameters**:

<table border=3>
  <tr>
    <th style="width: 10%;">
    Parameter name</th>
    <th style="width: 10%;">
    Patameter type</th>
    <th style="width: 60%;">
    Parameter description</th>
  </tr>
  <tr>
    <td><b>insuranceNumber</b></td>
    <td>string</td>
    <td>part of patient's insurance number</td>
  </tr>
  <tr>
    <td><b>insuranceProvider</b></td>
    <td>string</td>
    <td>part of patient's insurance provider name</td>
  </tr>
  <tr>
    <td><b>nestUser</b></td>
    <td>boolean</td>
    <td>true if returned patient object should include nested user record, false if only id</td>
  </tr>
</table>

***Example***

**Request**
```sh
    curl -X 'GET' \
    'api/patients' \
    -H 'Authorization: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMjN9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
```

**Response body**
```sh
    [{
        "id": "a3b9c5d7-8e2f-4a6b-9c3d-8e2f7a9b0c1d",
        "insuranceNumber": "INS123456789",
        "insuranceProvider": "HealthPlus"
    },
    {
        "id": "b4c8d6e1-9f2a-4b7c-8d9e-0a1b2c3d4e5f",
        "insuranceNumber": "INS987654321",
        "insuranceProvider": "CareCo"
    }]
```
***
#### GET `api/patients/{patientId}` 

**Purpose:** Get a patient by ID.

**Request headers:**

<table border=3>
<tr>
  <th style="width:20%;">Header name</th>
  <th>Header value</th>
  </tr>

  <tr>
  <td>Authorization</th>
  <td>Access token generated for user.</td>
  </tr>
</table>

**Request body:**

Empty

**Responses:**

<table border=3>
    <tr>
  <th style="width:20%;">Status code</th>
  <th>Response</th>
  </tr>

  <tr>
  <td>200</th>
  <td>Returns one patient record, which includes user id or record, insurance number and insurance provider name.</td>
  </tr>

  <tr>
  <td>404</th>
  <td>There is no such patient found.</td>
  </tr>
</table>

**Query Parameters**:

<table border=3>
  <tr>
    <th style="width: 10%;">
    Parameter name</th>
    <th style="width: 10%;">
    Patameter type</th>
    <th style="width: 60%;">
    Parameter description</th>
  </tr>
    <td><b>nestUser</b></td>
    <td>boolean</td>
    <td>true if returned patient object should include nested user record, false if only id</td>
  </tr>
</table>

***Example***

**Request**
```sh
    curl -X 'GET' \
    'api/patients/f9d4a1b2-3c56-4d78-a9b0-1e2f3c4d5e6f' \
    -H 'Authorization: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMjN9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
```
**Response body**
```sh
    {
    "id": "f9d4a1b2-3c56-4d78-a9b0-1e2f3c4d5e6f",
    "insuranceNumber": "INS456789012",
    "insuranceProvider": "MedCare"
    }
```
***
#### POST `api/patients` 

**Purpose:** Create new patient record for user and put it to the DB.

**Request headers:**

<table border=3>
<tr>
  <th style="width:20%;">Header name</th>
  <th>Header value</th>
  </tr>

  <tr>
  <td>Authorization</th>
  <td>Access token generated for user.</td>
  </tr>
</table>

**Request body:**

Patient object with information needed for a new patient, such as user's id, insurance number, insurance provider name.

**Responses:**

<table border=3>
    <tr>
  <th style="width:20%;">Status code</th>
  <th>Response</th>
  </tr>

  <tr>
  <td>201</th>
  <td>New patient record created for user and their record is returned.</td>
  </tr>

  <tr>
  <td>400</th>
  <td>Patient object misses fields or their data is invalid.</td>
  </tr>

  <tr>
  <td>409</th>
  <td>There is already a patient record for this user.</td>
  </tr>
</table>

***Example***

**Request**
```sh
    curl -X 'POST' \
    'api/patients' \
    -H 'Authorization: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMjN9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
    -H 'Content-Type: application/json' \
    -d '{
        "id": "b5e1c7d8-9f0a-4b2c-8d1e-2f3a4b5c6d7e",
        "insuranceNumber": "INS234567890",
        "insuranceProvider": "SecureHealth"
    }'
```
**Response body**
```sh
    {
        "id": "b5e1c7d8-9f0a-4b2c-8d1e-2f3a4b5c6d7e",
        "insuranceNumber": "INS234567890",
        "insuranceProvider": "SecureHealth"
    }
```
***
#### PUT `api/patients/{patientId}`

**Purpose:** Update record about a patient in the DB.

**Request headers:**

<table border=3>
<tr>
  <th style="width:20%;">Header name</th>
  <th>Header value</th>
  </tr>

  <tr>
  <td>Authorization</th>
  <td>Access token generated for user.</td>
  </tr>
</table>

**Request body:**

Object with patient's ID and updated information needed for a patient.

**Responses:**

<table border=3>
    <tr>
  <th style="width:20%;">Status code</th>
  <th>Response</th>
  </tr>

  <tr>
  <td>200</th>
  <td>Patient is updated and their updated record is returned.</td>
  </tr>

  <tr>
  <td>204</th>
  <td>ID is valid, but there is no data in request body to update.</td>

  <tr>
  <td>400</th>
  <td>Some of updated data is invalid.</td>
  </tr>

  <tr>
  <td>404</th>
  <td>User or patient record for the specified ID was not found.</td>
  </tr>
</table>

***Example***

**Request**
```sh
    curl -X 'PUT' \
    'api/patients/1' \
    -H 'Authorization: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMjN9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
    -H 'Content-Type: application/json' \
    -d '{
        "id": "d7e9c8f2-5a3b-4d6e-8f1a-9b0c2d3e4f5g",
        "insuranceNumber": "INS345678901",
        "insuranceProvider": "PrimeCare"
    }'
```
**Response body**
```sh
    {
        "id": "d7e9c8f2-5a3b-4d6e-8f1a-9b0c2d3e4f5g",
        "insuranceNumber": "INS345678901",
        "insuranceProvider": "PrimeCare"
    }
```
***
#### DELETE `api/patients/{patientId}` 

**Purpose:** Delete record about a patient from the DB.

**Request headers:**

<table border=3>
<tr>
  <th style="width:20%;">Header name</th>
  <th>Header value</th>
  </tr>

  <tr>
  <td>Authorization</th>
  <td>Access token generated for user.</td>
  </tr>
</table>

**Request body:**

Empty

**Responses:**

<table border=3>
    <tr>
  <th style="width:20%;">Status code</th>
  <th>Response</th>
  </tr>

  <tr>
  <td>204</th>
  <td>Patient record is deleted, nothing is returned.</td>
  </tr>

  <tr>
  <td>404</th>
  <td>User or their patient record for the specified ID was not found.</td>
  </tr>
</table>

***Example***

**Request**
```sh
    curl -X 'DELETE' \
    'api/patients/e8f7d6b2-4c9a-1d0e-8f3b-5a6c7d8e9f0g' \
    -H 'Authorization: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMjN9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
```

**Response body**
```sh
    Empty
```

### 5. Endpoint `api/symptoms/`:

***
#### GET `api/symptoms` 

**Purpose:** Get all symptoms.

**Request headers:**

<table border=3>
<tr>
  <th style="width:20%;">Header name</th>
  <th>Header value</th>
  </tr>

  <tr>
  <td>Authorization</th>
  <td>Access token generated for user.</td>
  </tr>
</table>

**Request body:**

Empty

**Responses:**

<table border=3>
<tr>
  <th style="width:20%;">Status code</th>
  <th>Response</th>
  </tr>

  <tr>
  <td>200</th>
  <td>Returns all symptom records, which include id, name and description.</td>
  </tr>

</table>

**Query Parameters**:

<table border=3>
  <tr>
    <th style="width: 10%;">
    Parameter name</th>
    <th style="width: 10%;">
    Patameter type</th>
    <th style="width: 60%;">
    Parameter description</th>
  </tr>
  <tr>
    <td><b>name</b></td>
    <td>string</td>
    <td>part of symptom's name</td>
  </tr>
  <tr>
    <td><b>description</b></td>
    <td>string</td>
    <td>part of symptom's description</td>
  </tr>
</table>

***Example***

**Request**
```sh
    curl -X 'GET' \
    'api/symptoms' \
    -H 'Authorization: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMjN9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
```
**Response body**
```sh
    [{
        "id": 1,
        "name": "string",
        "description": "string",
    },
    {
        "id": 1,
        "name": "string",
        "description": "string",
    }]
```
***
#### GET `api/symptoms/{symptomId}`

**Purpose:** Get a symptom by ID.

**Request headers:**

<table border=3>
<tr>
  <th style="width:20%;">Header name</th>
  <th>Header value</th>
  </tr>

  <tr>
  <td>Authorization</th>
  <td>Access token generated for user.</td>
  </tr>
</table>

**Request body:**

Empty

**Responses:**

<table border=3>
    <tr>
  <th style="width:20%;">Status code</th>
  <th>Response</th>
  </tr>

  <tr>
  <td>200</th>
  <td>Returns one symptom record, which includes id, name and description.</td>
  </tr>

  <tr>
  <td>404</th>
  <td>There is no such symptom found.</td>
  </tr>
</table>

***Example***

**Request**
```sh
    curl -X 'GET' \
    'api/symptoms/1' \
    -H 'Authorization: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMjN9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
```

**Response body**
```sh
    {
        "id": 1,
        "name": "string",
        "description": "string",
    }
```
***
#### POST `api/symptoms` 

**Purpose:** Create new symptom record and put it to the DB.

**Request headers:**

<table border=3>
<tr>
  <th style="width:20%;">Header name</th>
  <th>Header value</th>
  </tr>

  <tr>
  <td>Authorization</th>
  <td>Access token generated for user.</td>
  </tr>
</table>

**Request body:**

Symptom object with information needed for a new symptom, such as name and description.

**Responses:**

<table border=3>
    <tr>
  <th style="width:20%;">Status code</th>
  <th>Response</th>
  </tr>

  <tr>
  <td>201</th>
  <td>New symptom record created and its record is returned.</td>
  </tr>

  <tr>
  <td>400</th>
  <td>Symptom object misses fields or its data is invalid.</td>
  </tr>
</table>

***Example***

**Request**
```sh
    curl -X 'POST' \
    'api/symptoms' \
    -H 'Authorization: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMjN9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
    -H 'Content-Type: application/json' \
    -d '{
        "name": "string",
        "description": "string",
    }'
```
**Response body**
```sh
    {
        "id": 1,
        "name": "string",
        "description": "string",
    }
```

***
#### PUT `api/symptoms/{symptomId}` 

**Purpose:** Update record about a symptom in the DB.

**Request headers:**

<table border=3>
<tr>
  <th style="width:20%;">Header name</th>
  <th>Header value</th>
  </tr>

  <tr>
  <td>Authorization</th>
  <td>Access token generated for user.</td>
  </tr>
</table>

**Request body:**

Object with symptom's ID and updated information needed for a symptom.

**Responses:**

<table border=3>
    <tr>
  <th style="width:20%;">Status code</th>
  <th>Response</th>
  </tr>

  <tr>
  <td>200</th>
  <td>Symptom is updated and its updated record is returned.</td>
  </tr>

  <tr>
  <td>204</th>
  <td>ID is valid, but there is no data in request body to update.</td>

  <tr>
  <td>400</th>
  <td>Some of updated data is invalid.</td>
  </tr>

  <tr>
  <td>404</th>
  <td>Symptom record for the specified ID was not found.</td>
  </tr>
</table>

***Example***

**Request**
```sh
    curl -X 'PUT' \
    'api/symptoms/1' \
    -H 'Authorization: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMjN9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
    -H 'Content-Type: application/json' \
    -d '{
        "name": "string",
        "description": "string",
    }'
```
**Response body**
```sh
    {
        "id": 1,
        "name": "string",
        "description": "string",
    }
```

***
#### DELETE `api/symptoms/{symptomId}`

**Purpose:** Delete record about a symptom from the DB.

**Request headers:**

<table border=3>
<tr>
  <th style="width:20%;">Header name</th>
  <th>Header value</th>
  </tr>

  <tr>
  <td>Authorization</th>
  <td>Access token generated for user.</td>
  </tr>
</table>

**Request body:**

Empty

**Responses:**

<table border=3>
    <tr>
  <th style="width:20%;">Status code</th>
  <th>Response</th>
  </tr>

  <tr>
  <td>204</th>
  <td>Symptom record is deleted, nothing is returned.</td>
  </tr>

  <tr>
  <td>404</th>
  <td>Symptom record for the specified ID was not found.</td>
  </tr>
</table>

***Example***

**Request**
```sh
    curl -X 'DELETE' \
    'api/symptoms/1' \
    -H 'Authorization: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMjN9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
```

**Response body**
```sh
    Empty
```

### 6. Endpoint `api/organs/`:

***
#### GET `api/organs` 

**Purpose:** Get all organs.

**Request headers:**

<table border=3>
<tr>
  <th style="width:20%;">Header name</th>
  <th>Header value</th>
  </tr>

  <tr>
  <td>Authorization</th>
  <td>Access token generated for user.</td>
  </tr>
</table>

**Request body:**

Empty

**Responses:**

<table border=3>
<tr>
  <th style="width:20%;">Status code</th>
  <th>Response</th>
  </tr>

  <tr>
  <td>200</th>
  <td>Returns all organ records, which include id, name and description.</td>
  </tr>

</table>

**Query Parameters**:

<table border=3>
  <tr>
    <th style="width: 10%;">
    Parameter name</th>
    <th style="width: 10%;">
    Patameter type</th>
    <th style="width: 60%;">
    Parameter description</th>
  </tr>
  <tr>
    <td><b>name</b></td>
    <td>string</td>
    <td>part of organ's name</td>
  </tr>
  <tr>
    <td><b>description</b></td>
    <td>string</td>
    <td>part of organ's description</td>
  </tr>
</table>


***Example***

**Request**
```sh
    curl -X 'GET' \
    'api/organs' \
    -H 'Authorization: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMjN9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
```
 ​
**Response body**
```sh
    [{
        "id": 1,
        "name": "string",
        "description": "string",
    },
    {
        "id": 1,
        "name": "string",
        "description": "string",
    }]
```
***
#### GET `api/organs/{organId}` 

**Purpose:** Get a organ by ID.

**Request headers:**

<table border=3>
<tr>
  <th style="width:20%;">Header name</th>
  <th>Header value</th>
  </tr>

  <tr>
  <td>Authorization</th>
  <td>Access token generated for user.</td>
  </tr>
</table>

**Request body:**

Empty

**Responses:**

<table border=3>
    <tr>
  <th style="width:20%;">Status code</th>
  <th>Response</th>
  </tr>

  <tr>
  <td>200</th>
  <td>Returns one organ record, which includes id, name and description.</td>
  </tr>

  <tr>
  <td>404</th>
  <td>There is no such organ found.</td>
  </tr>
</table>


***Example***

**Request**
```sh
    curl -X 'GET' \
    'api/organs/1' \
    -H 'Authorization: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMjN9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
```

**Response body**
```sh
    {
        "id": 1,
        "name": "string",
        "description": "string",
    }
```
***
#### POST `api/organs`

**Purpose:** Create new organ record and put it to the DB.

**Request headers:**

<table border=3>
<tr>
  <th style="width:20%;">Header name</th>
  <th>Header value</th>
  </tr>

  <tr>
  <td>Authorization</th>
  <td>Access token generated for user.</td>
  </tr>
</table>

**Request body:**

Organ object with information needed for a new organ, such as name and description.

**Responses:**

<table border=3>
    <tr>
  <th style="width:20%;">Status code</th>
  <th>Response</th>
  </tr>

  <tr>
  <td>201</th>
  <td>New organ record created and its record is returned.</td>
  </tr>

  <tr>
  <td>400</th>
  <td>Organ object misses fields or its data is invalid.</td>
  </tr>
</table>


***Example***

**Request**
```sh
    curl -X 'POST' \
    'api/organs' \
    -H 'Authorization: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMjN9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
    -H 'Content-Type: application/json' \
    -d '{
        "name": "string",
        "description": "string",
    }'
```
**Response body**
```sh
    {
        "id": 1,
        "name": "string",
        "description": "string",
    }
```
***
#### PUT `api/organs/{organId}` 

**Purpose:** Update record about an organ in the DB.

**Request headers:**

<table border=3>
<tr>
  <th style="width:20%;">Header name</th>
  <th>Header value</th>
  </tr>

  <tr>
  <td>Authorization</th>
  <td>Access token generated for user.</td>
  </tr>
</table>

**Request body:**

Object with organ's ID and updated information needed for an organ.

**Responses:**

<table border=3>
    <tr>
  <th style="width:20%;">Status code</th>
  <th>Response</th>
  </tr>

  <tr>
  <td>200</th>
  <td>Organ is updated and its updated record is returned.</td>
  </tr>

  <tr>
  <td>204</th>
  <td>ID is valid, but there is no data in request body to update.</td>

  <tr>
  <td>400</th>
  <td>Some of updated data is invalid.</td>
  </tr>

  <tr>
  <td>404</th>
  <td>Organ record for the specified ID was not found.</td>
  </tr>
</table>

***Example***

**Request**
```sh
    curl -X 'PUT' \
    'api/organs/1' \
    -H 'Authorization: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMjN9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
    -H 'Content-Type: application/json' \
    -d '{
        "id": 1,
        "name": "string",
        "description": "string",
    }'
```
**Response body**
```sh
    {
        "id": 1,
        "name": "string",
        "description": "string",
    }
```
***
#### DELETE `api/organs/{organId}` 

**Purpose:** Delete record about an organ from the DB.

**Request headers:**

<table border=3>
<tr>
  <th style="width:20%;">Header name</th>
  <th>Header value</th>
  </tr>

  <tr>
  <td>Authorization</th>
  <td>Access token generated for user.</td>
  </tr>
</table>

**Request body:**

Empty

**Responses:**

<table border=3>
    <tr>
  <th style="width:20%;">Status code</th>
  <th>Response</th>
  </tr>

  <tr>
  <td>204</th>
  <td>Organ record is deleted, nothing is returned.</td>
  </tr>

  <tr>
  <td>404</th>
  <td>Organ record for the specified ID was not found.</td>
  </tr>
</table>

***Example***

**Request**
```sh
    curl -X 'DELETE' \
    'api/organs/1' \
    -H 'Authorization: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMjN9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
```

**Response body**
```sh
    Empty
```

### 7. Endpoint `api/specializations/`:

***
#### GET `api/specializations` 

**Purpose:** Get all specializations.

**Request headers:**

<table border=3>
<tr>
  <th style="width:20%;">Header name</th>
  <th>Header value</th>
  </tr>

  <tr>
  <td>Authorization</th>
  <td>Access token generated for user.</td>
  </tr>
</table>

**Request body:**

Empty

**Responses:**

<table border=3>
<tr>
  <th style="width:20%;">Status code</th>
  <th>Response</th>
  </tr>

  <tr>
  <td>200</th>
  <td>Returns all specialization records, which include id, name and description.</td>
  </tr>

</table>

**Query Parameters**:

<table border=3>
  <tr>
    <th style="width: 10%;">
    Parameter name</th>
    <th style="width: 10%;">
    Patameter type</th>
    <th style="width: 60%;">
    Parameter description</th>
  </tr>
  <tr>
    <td><b>name</b></td>
    <td>string</td>
    <td>part of specialization's name</td>
  </tr>
  <tr>
    <td><b>description</b></td>
    <td>string</td>
    <td>part of specialization's description</td>
  </tr>
</table>

***Example***

**Request**
```sh
    curl -X 'GET' \
    'api/specializations' \
    -H 'Authorization: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMjN9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
```
 ​
**Response body**
```sh
    [{
        "id": 1,
        "name": "string",
        "description": "string",
    },
    {
        "id": 1,
        "name": "string",
        "description": "string",
    }]
```
***
#### GET `api/specializations/{specializationId}` 

**Purpose:** Get a specialization by ID.

**Request headers:**

<table border=3>
<tr>
  <th style="width:20%;">Header name</th>
  <th>Header value</th>
  </tr>

  <tr>
  <td>Authorization</th>
  <td>Access token generated for user.</td>
  </tr>
</table>

**Request body:**

Empty

**Responses:**

<table border=3>
    <tr>
  <th style="width:20%;">Status code</th>
  <th>Response</th>
  </tr>

  <tr>
  <td>200</th>
  <td>Returns one specialization record, which includes id, name and description.</td>
  </tr>

  <tr>
  <td>404</th>
  <td>There is no such specialization found.</td>
  </tr>
</table>

***Example***

**Request**
```sh
    curl -X 'GET' \
    'api/specializations/1' \
    -H 'Authorization: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMjN9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
```

**Response body**
```sh
    {
        "id": 1,
        "name": "string",
        "description": "string",
    }
```
***
#### POST `api/specializations`

**Purpose:** Create new specialization record and put it to the DB.

**Request headers:**

<table border=3>
<tr>
  <th style="width:20%;">Header name</th>
  <th>Header value</th>
  </tr>

  <tr>
  <td>Authorization</th>
  <td>Access token generated for user.</td>
  </tr>
</table>

**Request body:**

Specialization object with information needed for a new specialization, such as name and description.

**Responses:**

<table border=3>
    <tr>
  <th style="width:20%;">Status code</th>
  <th>Response</th>
  </tr>

  <tr>
  <td>201</th>
  <td>New specialization record created and its record is returned.</td>
  </tr>

  <tr>
  <td>400</th>
  <td>Specialization object misses fields or its data is invalid.</td>
  </tr>
</table>

***Example***

**Request**
```sh
    curl -X 'POST' \
    'api/specializations' \
    -H 'Authorization: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMjN9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
    -H 'Content-Type: application/json' \
    -d '{
        "name": "string",
        "description": "string",
    }'
```
**Response body**
```sh
    {
        "id": 1,
        "name": "string",
        "description": "string",
    }
```
***
#### PUT `api/specializations/{specializationId}` 

**Purpose:** Update record about a specialization in the DB.

**Request headers:**

<table border=3>
<tr>
  <th style="width:20%;">Header name</th>
  <th>Header value</th>
  </tr>

  <tr>
  <td>Authorization</th>
  <td>Access token generated for user.</td>
  </tr>
</table>

**Request body:**

Object with specialization's ID and updated information needed for a specialization.

**Responses:**

<table border=3>
    <tr>
  <th style="width:20%;">Status code</th>
  <th>Response</th>
  </tr>

  <tr>
  <td>200</th>
  <td>Specialization is updated and its updated record is returned.</td>
  </tr>

  <tr>
  <td>204</th>
  <td>ID is valid, but there is no data in request body to update.</td>

  <tr>
  <td>400</th>
  <td>Some of updated data is invalid.</td>
  </tr>

  <tr>
  <td>404</th>
  <td>Specialization record for the specified ID was not found.</td>
  </tr>
</table>

***Example***

**Request**
```sh
    curl -X 'PUT' \
    'api/specializations/1' \
    -H 'Authorization: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMjN9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
    -H 'Content-Type: application/json' \
    -d '{
        "id": 1,
        "name": "string",
        "description": "string",
    }'
```
**Response body**
```sh
    {
        "id": 1,
        "name": "string",
        "description": "string",
    }
```
***
#### DELETE `api/specializations/{specializationId}` 

**Purpose:** Delete record about a specialization from the DB.

**Request headers:**

<table border=3>
<tr>
  <th style="width:20%;">Header name</th>
  <th>Header value</th>
  </tr>

  <tr>
  <td>Authorization</th>
  <td>Access token generated for user.</td>
  </tr>
</table>

**Request body:**

Empty

**Responses:**

<table border=3>
    <tr>
  <th style="width:20%;">Status code</th>
  <th>Response</th>
  </tr>

  <tr>
  <td>204</th>
  <td>Specialization record is deleted, nothing is returned.</td>
  </tr>

  <tr>
  <td>404</th>
  <td>Specialization record for the specified ID was not found.</td>
  </tr>
</table>

***Example***

**Request**
```sh
    curl -X 'DELETE' \
    'api/specializations/1' \
    -H 'Authorization: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMjN9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
```

**Response body**
```sh
    Empty
```

### 4. Endpoint `api/doctors/`:

***
#### GET `api/doctors`
Get all doctors. Server should answer with status code 200 and all doctors records.

- `id` (uuid): doctor's user record id


***Example***

**Request**
```sh
    curl -X 'GET' \
    'api/doctors' \
    -H 'Authorization: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMjN9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
```

**Response body**
```sh
    [{
        "id": 1,
        "phone": "string",
        "insurance": "string",
    },
    {
        "id": 2,
        "phone": "string",
        "insurance": "string",
    }]
```
***
#### GET `api/doctors/{doctorId}` 
Get a doctor by ID. Server should answer with status code 200 and one doctor record.


***Example***

**Request**
```sh
    curl -X 'GET' \
    'api/doctors/1' \
    -H 'Authorization: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMjN9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
```
**Response body**
```sh
    {
        "id": 1,
        "phone": "string",
        "insurance": "string",
    }
```
***
#### POST `api/doctors` 
Create record about new doctor and put it to the DB. The request should contain information needed for a new doctor, such as user's id, phone and insurance. Server should answer with status code 201 and id of doctor in the DB.


***Example***

**Request**
```sh
    curl -X 'POST' \
    'api/doctors' \
    -H 'Authorization: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMjN9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
    -H 'Content-Type: application/json' \
    -d '{
        "id": 1,
        "phone": "string",
        "insurance": "string",
    }'
```
**Response body**
```sh
    {
        "id": 1,
    }
```
***
#### PUT `api/doctors/{doctorId}`
Update record about a doctor in the DB. The request should contain updated information needed for a doctor. Server should answer with status code 200 and updated info of doctor in the DB.


***Example***

**Request**
```sh
    curl -X 'PUT' \
    'api/doctors/1' \
    -H 'Authorization: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMjN9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
    -H 'Content-Type: application/json' \
    -d '{
        "phone": "string",
        "insurance": "string",
    }'
```
**Response body**
```sh
    {
        "id": 1,
        "phone": "string",
        "insurance": "string",
    }
```
***
#### DELETE `api/doctors/{doctorId}` 
Delete record about a doctor from the DB. Server should answer with status code 204.


***Example***

**Request**
```sh
    curl -X 'DELETE' \
    'api/doctors/1' \
    -H 'Authorization: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMjN9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
```

**Response body**
```sh
    Empty
```

### 1. Endpoint `/api/appointments`

***
#### GET `/api/appointments`
Get all appointments. The server responds with status code 200 and all appointment records.

**Query Parameters**:
- `patientId` (uuid string): ID of the patient who signed up for the appointment
- `doctorId` (uuid string): ID of the doctor who signed up for the appointment 
- `startBefore` (string): Time before which appointments occur
- `startAfter` (string): Time after which appointments occur
- `endBefore` (string): Time before which appointments end
- `endAfter` (string): Time after which appointments end


***Example***

**Request**:
```sh
    curl -X 'GET' \
    '/api/appointments'\
    -H 'Authorization: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMjN9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
```
**Response body**
```sh
    [{
        "id": 1,
        "patientId": 1,
        "doctorId": 1,
        "start_time": *time*,
        "end_time": *time*,
        "info": "string",
    },
    {
        "id": 2,
        "patientId": 2,
        "doctorId": 2,
        "start_time": *time*,
        "end_time": *time*,
        "info": "string",
    }] 
```


***Example***

**Request**
```sh
    curl -X 'GET' \
    'api/appointments/?patientId=3' \
    -H 'Authorization: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMjN9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
```

**Response body**
```sh
    [{
        "id": 1,
        "patientId": 3,
        "doctorId": 1,
        "start_time": *time*,
        "end_time": *time*,
        "info": "string",
    },
    {
        "id": 2,
        "patientId": 3,
        "doctorId": 2,
        "start_time": *time*,
        "end_time": *time*,
        "info": "string",
    }]
```


***Example***

**Request**

```sh
    curl -X 'GET' \
    'api/appointments/?doctorId=4' \
    -H 'Authorization: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMjN9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
```

**Response body**
```sh
    [{
        "id": 1,
        "patientId": 1,
        "doctorId": 4,
        "start_time": *time*,
        "end_time": *time*,
        "info": "string",
    },
    {
        "id": 2,
        "patientId": 2,
        "doctorId": 4,
        "start_time": *time*,
        "end_time": *time*,
        "info": "string",
    }]
```

***
#### GET `api/appointments/{appointmetId}`
Get an appointment by ID.
Server should answer with status code 200 and one appointment record.


***Example***

**Request**
```sh
    curl -X 'GET' \
    'api/appointments/1' \
    -H 'Authorization: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMjN9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
```

**Response body**
```sh
    {
        "id": 1,
        "patientId": 1,
        "doctorId": 1,
        "start_time": *time*,
        "end_time": *time*,
        "info": "string",
    }
```

***
#### POST `api/appointments`
Create a record about new appointment and put it to the DB. The request should contain information needed for a new appointment, such as patient, doctor, time of its start, time of its end, additional text information.*SYMPTOMS???* 
Server should answer with status code 201 and id of record in the DB.


***Example***

**Request**
```sh
    curl -X 'POST' \
    'api/appointments' \
    -H 'Authorization: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMjN9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
    -H 'Content-Type: application/json' \
    -d '{
        "patientId": 1,
        "doctorId": 1,
        "start_time": *time*,
        "end_time": *time*,
        "info": "string",
    }'
```

**Response body**
```sh
    {
        "id": 1,
    }
```

***
#### PUT `api/appointments/{appointmetId}`
Update record about an appointment in the DB. The request should contain updated information needed for an appointment. *SYMPTOMS???* Server should answer with status code 200 and updated info of record in the DB.


***Example***

**Request**
```sh
    curl -X 'PUT' \
    'api/appointments/1' \
    -H 'Authorization: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMjN9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
    -H 'Content-Type: application/json' \
    -d '{
        "id": 1,
        "patientId": 1,
        "doctorId": 1,
        "start_time": *time*,
        "end_time": *time*,
        "info": "string",
    }'
```
**Response body**
```sh
    {
        "id": 1,
        "patientId": 1,
        "doctorId": 1,
        "start_time": *time*,
        "end_time": *time*,
        "info": "string",
    }
```

***
#### DELETE `api/appointments/{appointmetId}`
Delete record about an appointment from the DB. Server should answer with status code 204.


***Example***

**Request**
```sh
    curl -X 'DELETE' \
    'api/appointments/1' \
    -H 'Authorization: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMjN9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
```

**Response body**
```sh
    Empty
```
