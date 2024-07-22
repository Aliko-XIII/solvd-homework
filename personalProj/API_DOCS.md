# API Documentation

## Description
This project is a hospital appointments app. The application has the following functionality: add, update, delete, and get information about appointments, patients, doctors, their specializations, symptoms, and organs they work with.

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
Get all patients. Server should answer with status code 200 and all patients records.

- `id` (uuid): patient's user record id
- `insuranceNumber` (string): part of patient's insurance number
- `insuranceProvider` (string): part of patient's insurance provider name


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
Get a patient by ID. Server should answer with status code 200 and one patient record.


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
Create record about new patient and put it to the DB. The request should contain information needed for a new patient, such as user's id, phone and insurance. Server should answer with status code 201 and id of patient in the DB.


***Example***

**Request**
```sh
    curl -X 'POST' \
    'api/patients' \
    -H 'Authorization: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMjN9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
    -H 'Content-Type: application/json' \
    -d '{
        "insuranceNumber": "INS234567890",
        "insuranceProvider": "SecureHealth"
    }'
```
**Response body**
```sh
    {
        "id": "b5e1c7d8-9f0a-4b2c-8d1e-2f3a4b5c6d7e",
    }
```
***
#### PUT `api/patients/{patientId}`
Update record about a patient in the DB. The request should contain updated information needed for a patient. Server should answer with status code 200 and updated info of patient in the DB.


***Example***

**Request**
```sh
    curl -X 'PUT' \
    'api/patients/1' \
    -H 'Authorization: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMjN9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
    -H 'Content-Type: application/json' \
    -d '{
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
Delete record about a patient from the DB. Server should answer with status code 204.


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
Get all symptoms. Server should answer with status code 200 and all symptoms records.

- `name` (string): part of symptoms's name
- `description` (string): part of symptom's description


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
Get a symptom by ID. Server should answer with status code 200 and one symptom record.


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
Create record about new symptom and put it to the DB. The request should contain information needed for a new symptom, such as symptom's name and description. Server should answer with status code 201 and id of symptom in the DB.


***Example***

**Request**
```sh
    curl -X 'POST' \
    'api/symptoms' \
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
    }
```

***
#### PUT `api/symptoms/{symptomId}` 
Update record about a symptom in the DB. The request should contain updated information needed for a symptom. Server should answer with status code 200 and updated info of symptom in the DB.


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
Delete record about a symptom from the DB. Server should answer with status code 204.


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
Get all organs. Server should answer with status code 200 and all organs records.

- `name` (string): part of organ's name
- `description` (string): part of organ's description


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
Get a organ by ID. Server should answer with status code 200 and one organ record.


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
Create record about new organ and put it to the DB. The request should contain information needed for a new organ, such as organ's name and description. Server should answer with status code 201 and id of organ in the DB.


***Example***

**Request**
```sh
    curl -X 'POST' \
    'api/organs' \
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
    }
```
***
#### PUT `api/organs/{organId}` 
Update record about a organ in the DB. The request should contain updated information needed for a organ. Server should answer with status code 200 and updated info of organ in the DB.


***Example***

**Request**
```sh
    curl -X 'PUT' \
    'api/organs/1' \
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
#### DELETE `api/organs/{organId}` 
Delete record about a organ from the DB. Server should answer with status code 204.


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
Get all specializations. Server should answer with status code 200 and all specializations records.

- `name` (string): part of specialization's name
- `description` (string): part of specialization's description


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
Get a specialization by ID. Server should answer with status code 200 and one specialization record.


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
Create record about new specialization and put it to the DB. The request should contain information needed for a new specialization, such as specialization's name and description. Server should answer with status code 201 and id of specialization in the DB.


***Example***

**Request**
```sh
    curl -X 'POST' \
    'api/specializations' \
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
    }
```
***
#### PUT `api/specializations/{specializationId}` 
Update record about a specialization in the DB. The request should contain updated information needed for a specialization. Server should answer with status code 200 and updated info of specialization in the DB.


***Example***

**Request**
```sh
    curl -X 'PUT' \
    'api/specializations/1' \
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
#### DELETE `api/specializations/{specializationId}` 
Delete record about a specialization from the DB. Server should answer with status code 204.


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
