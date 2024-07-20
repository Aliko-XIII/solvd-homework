# API Documentation

## Description
This project is a hospital appointments app. The application has the following functionality: add, update, delete, and get information about appointments, patients, doctors, their specializations, symptoms, and organs they work with.

## Technical Requirements
- **Programming Language**: JavaScript
- **Database**: PostgreSQL
- **Containerization**: Docker

## Base URL
`http://localhost:3000`

*ADD MORE PARAMS LIKE ?name=test*


## API Endpoints

### 1. Endpoint `/api/appointments`

#### GET `/api/appointments`
Get all appointments. The server responds with status code 200 and all appointment records.

**Query Parameters**:
- `patientId` (uuid string): ID of the patient who signed up for the appointment
- `doctorId` (uuid string): ID of the doctor who signed up for the appointment 
- `startBefore` (string): Time before which appointments occur
- `startAfter` (string): Time after which appointments occur
- `endBefore` (string): Time before which appointments end
- `endAfter` (string): Time after which appointments end

**Request**:
```sh
    curl -X 'GET' \\
    '/api/appointments'\\
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

**Request**
```sh
    curl -X 'GET' \\
    'api/appointments/?patientId=3' \\
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

**Request**

```sh
    curl -X 'GET' \\
    'api/appointments/?doctorId=4' \\
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

#### GET `api/appointments/{appointmetId}`
Get an appointment by ID.
Server should answer with status code 200 and one appointment record.

**Request**
```sh
    curl -X 'GET' \\
    'api/appointments/1' \\
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

#### POST `api/appointments`
Create a record about new appointment and put it to the DB. The request should contain information needed for a new appointment, such as patient, doctor, time of its start, time of its end, additional text information.*SYMPTOMS???* 
Server should answer with status code 201 and id of record in the DB.

**Request**
```sh
    curl -X 'POST' \\
    'api/appointments' \\
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

#### PUT `api/appointments/{appointmetId}`
Update record about an appointment in the DB. The request should contain updated information needed for an appointment. *SYMPTOMS???* Server should answer with status code 200 and updated info of record in the DB.

**Request**
```sh
    curl -X 'PUT' \\
    'api/appointments/1' \\
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

#### DELETE `api/appointments/{appointmetId}`
Delete record about an appointment from the DB. Server should answer with status code 204.

**Request**
```sh
    curl -X 'DELETE' \\
    'api/appointments/1' \\
```

**Response body**
```sh
    Empty
```

### 2. Endpoint `api/users/`:

#### GET `api/users`
Get all users. Server should answer with status code 200 and all user records.

**Query Parameters**:

- `name` (string): part of users' name
- `surname` (string) part of users' surname
- `minAge` (integer): bottom border for users' age
- `maxAge` (integer): top border for users' age
- `sex` (string): user's sex

**Request**
```sh
    curl -X 'GET' \\
    'api/users' \\
```

**Response body**
```sh
    [{
        "id": 1,
        "name": "string",
        "surname": "string",
        "age": 26,
        "sex": "string",
        "password": "string",
    },
    {
        "id": 2,
        "name": "string",
        "surname": "string",
        "age": 19,
        "sex": "string",
        "password": "string",
    }]
```

**Request**
```sh
    curl -X 'GET' \\
    'api/users/?name=Br' \\
```
   ​
**Response body**
```sh
    [{
        "id": 1,
        "name": "Bruce",
        "surname": "string",
        "age": 26,
        "sex": "string",
        "password": "string",
    },
    {
        "id": 2,
        "name": "Brian",
        "surname": "string",
        "age": 19,
        "sex": "string",
        "password": "string",
    }]
```

#### GET `api/users/{userId}`
Get a user by ID. Server should answer with status code 200 and one user record.

**Request**
```sh
    curl -X 'GET' \\
    'api/users/1' \\
```

**Response body**
```sh
    {
        "id": 1,
        "name": "string",
        "surname": "string",
        "age": 19,
        "sex": "string",
        "password": "string",
    }
```

#### POST `api/users` 
Create record about new user and put it to the DB. The request should contain information needed for a new user, such as first name, last name, age, sex, password. Server should answer with status code 201 and id of user in the DB.

**Request**
```sh
    curl -X 'POST' \\
    'api/users' \\
    -d '{
        "name": "string",
        "surname": "string",
        "age": 19,
        "sex": "string",
        "password": "string",
    }'
```

**Response body**
```sh
    {
        "id": 1,
    }
```

#### PUT `api/users/{userId}` 
Update record about a user in the DB. The request should contain updated information needed for a user. Server should answer with status code 200 and updated info of user in the DB.

**Request**
```sh
    curl -X 'PUT' \\
    'api/users/1' \\
    -d '{
        "id": 1,
        "name": "string",
        "surname": "string",
        "age": 19,
        "sex": "string",
        "password": "string",
    }'
```

**Response body**
```sh
    {
        "id": 1,
        "name": "string",
        "surname": "string",
        "age": 19,
        "sex": "string",
        "password": "string",
    }
```

#### DELETE `api/users/{userId}` 
Delete record about a user from the DB. Server should answer with status code 204.

**Request**
```sh
    curl -X 'DELETE' \\
    'api/users/1' \\
```

**Response body**
```sh
    Empty
```

### 3. Endpoint `api/patients/`:

#### GET `api/patients`
Get all patients. Server should answer with status code 200 and all patients records.

- `id` (uuid): patient's user record id
- `phone` (string): part of patient's phone number
- `insurance` (string): part of patient's insurance number

**Request**
```sh
    curl -X 'GET' \\
    'api/patients' \\
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
#### GET `api/patients/{patientId}` 
Get a patient by ID. Server should answer with status code 200 and one patient record.

**Request**
```sh
    curl -X 'GET' \\
    'api/patients/1' \\
```
**Response body**
```sh
    {
        "id": 1,
        "phone": "string",
        "insurance": "string",
    }
```
#### POST `api/patients` 
Create record about new patient and put it to the DB. The request should contain information needed for a new patient, such as user's id, phone and insurance. Server should answer with status code 201 and id of patient in the DB.

**Request**
```sh
    curl -X 'POST' \\
    'api/patients' \\
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
#### PUT `api/patients/{patientId}`
Update record about a patient in the DB. The request should contain updated information needed for a patient. Server should answer with status code 200 and updated info of patient in the DB.

**Request**
```sh
    curl -X 'PUT' \\
    'api/patients/1' \\
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
#### DELETE `api/patients/{patientId}` 
Delete record about a patient from the DB. Server should answer with status code 204.

**Request**
```sh
    curl -X 'DELETE' \\
    'api/patients/1' \\
```

**Response body**
```sh
    Empty
```

### 4. Endpoint `api/symptoms/`:

#### GET `api/symptoms` 
Get all symptoms. Server should answer with status code 200 and all symptoms records.

- `name` (string): part of symptoms's name
- `description` (string): part of symptom's description

**Request**
```sh
    curl -X 'GET' \\
    'api/symptoms' \\
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
#### GET `api/symptoms/{symptomId}`
Get a symptom by ID. Server should answer with status code 200 and one symptom record.

**Request**
```sh
    curl -X 'GET' \\
    'api/symptoms/1' \\
```

**Response body**
```sh
    {
        "id": 1,
        "name": "string",
        "description": "string",
    }
```
#### POST `api/symptoms` 
Create record about new symptom and put it to the DB. The request should contain information needed for a new symptom, such as symptom's name and description. Server should answer with status code 201 and id of symptom in the DB.

**Request**
```sh
    curl -X 'POST' \\
    'api/symptoms' \\
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

#### PUT `api/symptoms/{symptomId}` 
Update record about a symptom in the DB. The request should contain updated information needed for a symptom. Server should answer with status code 200 and updated info of symptom in the DB.

**Request**
```sh
    curl -X 'PUT' \\
    'api/symptoms/1' \\
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

#### DELETE `api/symptoms/{symptomId}`
Delete record about a symptom from the DB. Server should answer with status code 204.

**Request**
```sh
    curl -X 'DELETE' \\
    'api/symptoms/1' \\
```

**Response body**
```sh
    Empty
```

### 5. Endpoint `api/organs/`:

#### GET `api/organs` 
Get all organs. Server should answer with status code 200 and all organs records.

- `name` (string): part of organ's name
- `description` (string): part of organ's description

**Request**
```sh
    curl -X 'GET' \\
    'api/organs' \\
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
#### GET `api/organs/{organId}` 
Get a organ by ID. Server should answer with status code 200 and one organ record.

**Request**
```sh
    curl -X 'GET' \\
    'api/organs/1' \\
```

**Response body**
```sh
    {
        "id": 1,
        "name": "string",
        "description": "string",
    }
```
#### POST `api/organs`
Create record about new organ and put it to the DB. The request should contain information needed for a new organ, such as organ's name and description. Server should answer with status code 201 and id of organ in the DB.

**Request**
```sh
    curl -X 'POST' \\
    'api/organs' \\
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
#### PUT `api/organs/{organId}` 
Update record about a organ in the DB. The request should contain updated information needed for a organ. Server should answer with status code 200 and updated info of organ in the DB.

**Request**
```sh
    curl -X 'PUT' \\
    'api/organs/1' \\
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
#### DELETE `api/organs/{organId}` 
Delete record about a organ from the DB. Server should answer with status code 204.

**Request**
```sh
    curl -X 'DELETE' \\
    'api/organs/1' \\
```

**Response body**
```sh
    Empty
```

