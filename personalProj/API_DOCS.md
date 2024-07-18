API documentation 

Description
This project is a hospital appointments app. The application has the following functionality: add, update, delete and get information about appointments, patients, doctors, their specializations, symptoms and organs they work with.

Technical requirements
Programming language - Javascript
Database - PostgreSQL
*???Docker???*


*ADD URLs WITH PARAMS LIKE ?name=shit*
Base URL
http://localhost:3000

API Documentation
1. Endpoint api/appointments/:

- GET api/appointments - get all appointments
Server should answer with status code 200 and all appointments records.

patientId - integer, id of patient which signed up appointments
doctorId - integer, id of doctor which signed up appointments 
startBefore - string, string represantation of time before which appointments occur
startAfter - string, string represantation of time after which appointments occur
endBefore - string, string represantation of time before which appointments end
endAfter - string, string represantation of time after which appointments end

Request

    curl -X 'GET' \\
    ‘api/appointments \\
    ​
Response body

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

Request

    curl -X 'GET' \\
    ‘api/appointments/?patientId=3 \\
    ​
Response body

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

Request

    curl -X 'GET' \\
    ‘api/appointments/?doctorId=4 \\
    ​
Response body

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

- GET api/appointments/{appointmetId} - get an appointment by ID
Server should answer with status code 200 and one appointment record.

Request

    curl -X 'GET' \\
    ‘api/appointments/1 \\
    ​
Response body

    {
        "id": 1,
        "patientId": 1,
        "doctorId": 1,
        "start_time": *time*,
        "end_time": *time*,
        "info": "string",
    }

- POST api/appointments - create record about new appointment and put it to the DB. The request should contain information needed for a new appointment, such as patient, doctor, time of its start, time of its end, additional text information.*SYMPTOMS???*

Server should answer with status code 201 and id of record in the DB.

Request

    curl -X 'POST' \\
    ‘api/appointments \\
    -d '{
        "patientId": 1,
        "doctorId": 1,
        "start_time": *time*,
        "end_time": *time*,
        "info": "string",
    }'

Response body

    {
        "id": 1,
    }

- PUT api/appointments/{appointmetId} - update record about an appointment in the DB. The request should contain updated information needed for an appointment.*SYMPTOMS???*

Server should answer with status code 200 and updated info of record in the DB.

Request

    curl -X 'PUT' \\
    ‘api/appointments/1 \\
    -d '{
        "id": 1,
        "patientId": 1,
        "doctorId": 1,
        "start_time": *time*,
        "end_time": *time*,
        "info": "string",
    }'

Response body

    {
        "id": 1,
        "patientId": 1,
        "doctorId": 1,
        "start_time": *time*,
        "end_time": *time*,
        "info": "string",
    }

- DELETE api/appointments/{appointmetId} - delete record about an appointment from the DB.

Server should answer with status code 204.

Request

    curl -X 'DELETE' \\
    ‘api/appointments/1 \\


Response body

    Empty


2. Endpoint api/users/:

- GET api/users - get all users
Server should answer with status code 200 and all user records.

name - string, part of users' name
surname - string, part of users' surname
minAge - integer, bottom border for users' age
maxAge - integer, top border for users' age
sex - string, user's sex

Request

    curl -X 'GET' \\
    ‘api/users \\
    ​
Response body

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

Request

    curl -X 'GET' \\
    ‘api/users/?name=Br \\
    ​
Response body

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


- GET api/users/{userId} - get a user by ID
Server should answer with status code 200 and one user record.

Request

    curl -X 'GET' \\
    ‘api/users/1 \\
    ​
Response body

    {
        "id": 1,
        "name": "string",
        "surname": "string",
        "age": 19,
        "sex": "string",
        "password": "string",
    }

- POST api/users - create record about new user and put it to the DB. The request should contain information needed for a new user, such as first name, last name, age, sex, password.

Server should answer with status code 201 and id of user in the DB.

Request

    curl -X 'POST' \\
    ‘api/users \\
    -d '{
        "name": "string",
        "surname": "string",
        "age": 19,
        "sex": "string",
        "password": "string",
    }'

Response body

    {
        "id": 1,
    }

- PUT api/users/{userId} - update record about a user in the DB. The request should contain updated information needed for a user.

Server should answer with status code 200 and updated info of user in the DB.

Request

    curl -X 'PUT' \\
    ‘api/users/1 \\
    -d '{
        "id": 1,
        "name": "string",
        "surname": "string",
        "age": 19,
        "sex": "string",
        "password": "string",
    }'

Response body

    {
        "id": 1,
        "name": "string",
        "surname": "string",
        "age": 19,
        "sex": "string",
        "password": "string",
    }

- DELETE api/users/{userId} - delete record about a user from the DB.

Server should answer with status code 204.

Request

    curl -X 'DELETE' \\
    ‘api/users/1 \\


Response body

    Empty

3. Endpoint api/patients/:

- GET api/patients - get all patients
Server should answer with status code 200 and all patients records.

id - patient's user record id

phone - string, part of patient's phone number
insurance - string, part of patient's insurance number

Request

    curl -X 'GET' \\
    ‘api/patients \\
    ​
Response body

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

- GET api/patients/{patientId} - get a patient by ID
Server should answer with status code 200 and one patient record.

Request

    curl -X 'GET' \\
    ‘api/patients/1 \\
    ​
Response body

    {
        "id": 1,
        "phone": "string",
        "insurance": "string",
    }

- POST api/patients - create record about new patient and put it to the DB. The request should contain information needed for a new patient, such as user's id, phone and insurance.

Server should answer with status code 201 and id of patient in the DB.

Request

    curl -X 'POST' \\
    ‘api/patients \\
    -d '{
        "id": 1,
        "phone": "string",
        "insurance": "string",
    }'

Response body

    {
        "id": 1,
    }

- PUT api/patients/{patientId} - update record about a patient in the DB. The request should contain updated information needed for a patient.

Server should answer with status code 200 and updated info of patient in the DB.

Request

    curl -X 'PUT' \\
    ‘api/patients/1 \\
    -d '{
        "phone": "string",
        "insurance": "string",
    }'

Response body

    {
        "id": 1,
        "phone": "string",
        "insurance": "string",
    }

- DELETE api/patients/{patientId} - delete record about a patient from the DB.

Server should answer with status code 204.

Request

    curl -X 'DELETE' \\
    ‘api/patients/1 \\


Response body

    Empty

4. Endpoint api/symptoms/:

- GET api/symptoms - get all symptoms
Server should answer with status code 200 and all symptoms records.

name - string, part of symptoms's name
description - string, part of symptom's description

Request

    curl -X 'GET' \\
    ‘api/symptoms \\
    ​
Response body

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

- GET api/symptoms/{symptomId} - get a symptom by ID
Server should answer with status code 200 and one symptom record.

Request

    curl -X 'GET' \\
    ‘api/symptoms/1 \\
    ​
Response body

    {
        "id": 1,
        "name": "string",
        "description": "string",
    }

- POST api/symptoms - create record about new symptom and put it to the DB. The request should contain information needed for a new symptom, such as symptom's name and description.

Server should answer with status code 201 and id of symptom in the DB.

Request

    curl -X 'POST' \\
    ‘api/symptoms \\
    -d '{
        "id": 1,
        "name": "string",
        "description": "string",
    }'

Response body

    {
        "id": 1,
    }

- PUT api/symptoms/{symptomId} - update record about a symptom in the DB. The request should contain updated information needed for a symptom.

Server should answer with status code 200 and updated info of symptom in the DB.

Request

    curl -X 'PUT' \\
    ‘api/symptoms/1 \\
    -d '{
        "name": "string",
        "description": "string",
    }'

Response body

    {
        "id": 1,
        "name": "string",
        "description": "string",
    }

- DELETE api/symptoms/{symptomId} - delete record about a symptom from the DB.

Server should answer with status code 204.

Request

    curl -X 'DELETE' \\
    ‘api/symptoms/1 \\


Response body

    Empty


5. Endpoint api/organs/:

- GET api/organs - get all organs
Server should answer with status code 200 and all organs records.

name - string, part of organ's name
description - string, part of organ's description

Request

    curl -X 'GET' \\
    ‘api/organs \\
    ​
Response body

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

- GET api/organs/{organId} - get a organ by ID
Server should answer with status code 200 and one organ record.

Request

    curl -X 'GET' \\
    ‘api/organs/1 \\
    ​
Response body

    {
        "id": 1,
        "name": "string",
        "description": "string",
    }

- POST api/organs - create record about new organ and put it to the DB. The request should contain information needed for a new organ, such as organ's name and description.

Server should answer with status code 201 and id of organ in the DB.

Request

    curl -X 'POST' \\
    ‘api/organs \\
    -d '{
        "id": 1,
        "name": "string",
        "description": "string",
    }'

Response body

    {
        "id": 1,
    }

- PUT api/organs/{organId} - update record about a organ in the DB. The request should contain updated information needed for a organ.

Server should answer with status code 200 and updated info of organ in the DB.

Request

    curl -X 'PUT' \\
    ‘api/organs/1 \\ц
    -d '{
        "name": "string",
        "description": "string",
    }'

Response body

    {
        "id": 1,
        "name": "string",
        "description": "string",
    }

- DELETE api/organs/{organId} - delete record about a organ from the DB.

Server should answer with status code 204.

Request

    curl -X 'DELETE' \\
    ‘api/organs/1 \\


Response body

    Empty


