# Database Tables Documentation

## Enum Type: sex

The sex enum type is used to represent the sex of users. It consists of two possible values:
```
M: Represents male.
F: Represents female.
```
## Table: users

### Description
This table stores user information including personal details, contact information, and unique identifiers.

### Columns

- **user_id** (`uuid`): 
  - Description: A unique identifier for each user, generated automatically.
  - Default: `gen_random_uuid()`
  - Constraints: Primary Key

- **first_name** (`character varying`): 
  - Description: The first name of the user.
  - Constraints: Not Null, Check (char_length(first_name) > 0)

- **last_name** (`character varying`): 
  - Description: The last name of the user.
  - Constraints: Not Null, Check (char_length(last_name) > 0)

- **age** (`integer`): 
  - Description: The age of the user.
  - Constraints: Check (age >= 0 AND age <= 120)

- **sex** (`sex_type`): 
  - Description: The sex of the user.
  - Constraints: None

- **pass** (`character varying`): 
  - Description: The password for the user account.
  - Constraints: Not Null, Check (char_length(pass) > 6 AND char_length(pass) < 32)

- **phone** (`character varying`): 
  - Description: The phone number of the user.
  - Constraints: Not Null, Unique, Check (char_length(phone) >= 10)

### Constraints

- **Primary Key**: `user_id`
- **Unique**: `phone`
- **Check**: 
  - `age_valid`: age >= 0 AND age <= 120
  - `pass_length`: char_length(pass) > 6 AND char_length(pass) < 32
  - `phone_length`: char_length(phone) >= 10
  - `first_name_length`: char_length(first_name) > 0
  - `last_name_length`: char_length(last_name) > 0

 
## Table: patients

### Description
This table stores information about patients, including their insurance details.

### Columns

- **user_id** (`uuid`): 
  - Description: A unique identifier for each patient, linked to a user in the users table.
  - Constraints: Primary Key, Foreign Key referencing users(user_id)

- **insurance_number** (`character varying`): 
  - Description: The insurance number of the patient.
  - Constraints: Check (char_length(insurance_number) > 0)

- **insurance_provider** (`character varying`): 
  - Description: The name of the patient's insurance provider.
  - Constraints: Check (char_length(insurance_provider) > 0)

### Constraints

- **Primary Key**: `user_id`
- **Foreign Key**: `user_id` references users(user_id)
  - **On Update**: Cascade
  - **On Delete**: Set Null
- **Check**: 
  - `insurance_number_length`: char_length(insurance_number) > 0
    - `insurance_provider_length`: char_length(insurance_provider) > 0


## Table: symptoms

### Description
This table stores information about symptoms that can be associated with various medical conditions.

### Columns

- **symptom_id** (`integer`): 
  - Description: A unique identifier for each symptom, generated automatically in a sequential order.
  - Default: `nextval('symptoms_symptom_id_seq')`
  - Constraints: Primary Key, Serial

- **symptom_name** (`character varying`): 
  - Description: The name of the symptom.
  - Constraints: Not Null, Check (char_length(symptom_name) > 0)

- **symptom_description** (`text`): 
  - Description: A description of the symptom.
  - Constraints: None

### Constraints

- **Primary Key**: `symptom_id`
- **Check**: 
  - `symptom_name_length`: char_length(symptom_name) > 0


## Table: organs

### Description
This table stores information about various organs in the human body.

### Columns

- **organ_id** (`integer`): 
  - Description: A unique identifier for each organ, generated automatically in a sequential order.
  - Default: `nextval('organs_organ_id_seq')`
  - Constraints: Primary Key

- **organ_name** (`character varying`): 
  - Description: The name of the organ.
  - Constraints: Not Null, Check (char_length(organ_name) > 0)

- **organ_description** (`text`): 
  - Description: A description of the organ.
  - Constraints: None

### Constraints

- **Primary Key**: `organ_id`
- **Check**: 
  - `organ_name_length`: char_length(organ_name) > 0

## Table: specializations

### Description
This table stores information about different medical specializations.

### Columns

- **specialization_id** (`integer`): 
  - Description: A unique identifier for each specialization, generated automatically in a sequential order.
  - Default: `nextval('specializations_specialization_id_seq')`
  - Constraints: Primary Key

- **specialization_name** (`character varying`): 
  - Description: The name of the specialization.
  - Constraints: Not Null, Check (char_length(specialization_name) > 0)

- **specialization_description** (`text`): 
  - Description: A description of the specialization.
  - Constraints: None

### Constraints

- **Primary Key**: `specialization_id`
- **Check**: 
  - `specialization_name_length`: char_length(specialization_name) > 0

## Table: specializations_to_symptoms

### Description
This table links medical specializations to symptoms, indicating which symptoms are associated with each specialization.

### Columns

- **record_id** (`integer`): 
  - Description: A unique identifier for each record, generated automatically in a sequential order.
  - Default: `nextval('specializations_to_symptoms_record_id_seq')`
  - Constraints: Primary Key, Serial

- **specialization_id** (`integer`): 
  - Description: The identifier for the specialization.
  - Constraints: Not Null, Foreign Key referencing `specializations(specialization_id)`

- **symptom_id** (`integer`): 
  - Description: The identifier for the symptom.
  - Constraints: Not Null, Foreign Key referencing `symptoms(symptom_id)`

### Constraints

- **Primary Key**: `record_id`
- **Foreign Key**: `specialization_id` references `specializations(specialization_id)`
  - **On Update**: Cascade
  - **On Delete**: Cascade
- **Foreign Key**: `symptom_id` references `symptoms(symptom_id)`
  - **On Update**: Cascade
  - **On Delete**: Cascade

## Table: specializations_to_organs

### Description
This table links medical specializations to organs, indicating which organs are associated with each specialization.

### Columns

- **record_id** (`integer`): 
  - Description: A unique identifier for each record, generated automatically in a sequential order.
  - Default: `nextval('specializations_to_organs_record_id_seq')`
  - Constraints: Primary Key, Serial

- **specialization_id** (`integer`): 
  - Description: The identifier for the specialization.
  - Constraints: Not Null, Foreign Key referencing `specializations(specialization_id)`

- **organ_id** (`integer`): 
  - Description: The identifier for the organ.
  - Constraints: Not Null, Foreign Key referencing `organs(organ_id)`

### Constraints

- **Primary Key**: `record_id`
- **Foreign Key**: `specialization_id` references `specializations(specialization_id)`
  - **On Update**: Cascade
  - **On Delete**: Cascade
- **Foreign Key**: `organ_id` references `organs(organ_id)`
  - **On Update**: Cascade
  - **On Delete**: Cascade

## Table: doctors

### Description
This table stores information about doctors, including their specialization, work hours, and patient load.

### Columns

- **user_id** (`uuid`): 
  - Description: A unique identifier for each doctor, linked to a user in the users table.
  - Constraints: Primary Key, Foreign Key referencing users(user_id)

- **specialization_id** (`integer`): 
  - Description: The specialization of the doctor.
  - Constraints: Not Null, Foreign Key referencing specializations(specialization_id)

- **patient_load** (`smallint`): 
  - Description: The number of patients assigned to the doctor.
  - Constraints: Not Null, Check (patient_load > 0)

- **workday_start** (`time without time zone`): 
  - Description: The start time of the doctor's workday.
  - Constraints: None

- **workday_end** (`time without time zone`): 
  - Description: The end time of the doctor's workday.
  - Constraints: None

### Constraints

- **Primary Key**: `user_id`
- **Foreign Key**: 
  - `specialization_id` references specializations(specialization_id)
    - **On Update**: Cascade
    - **On Delete**: Set Null
  - `user_id` references users(user_id)
    - **On Update**: Cascade
    - **On Delete**: Cascade
- **Check**: 
  - `patient_load_valid`: patient_load > 0
  - `workday_valid`: workday_start < workday_end


## Table: appointments

### Description
This table stores information about appointments between patients and doctors, including scheduling details and additional information.

### Columns

- **appointment_id** (`integer`): 
  - Description: A unique identifier for each appointment, generated automatically in a sequential order.
  - Default: `nextval('appointments_appointment_id_seq')`
  - Constraints: Primary Key, Serial

- **patient_id** (`uuid`): 
  - Description: The unique identifier for the patient associated with the appointment.
  - Constraints: Foreign Key referencing `patients(user_id)`

- **doctor_id** (`uuid`): 
  - Description: The unique identifier for the doctor associated with the appointment.
  - Constraints: Foreign Key referencing `doctors(user_id)`

- **appointment_time** (`timestamp without time zone`): 
  - Description: The date and time of the appointment.
  - Constraints: Not Null

- **appointment_duration** (`interval`): 
  - Description: The duration of the appointment.
  - Constraints: Not Null

- **additional_info** (`text`): 
  - Description: Any additional information or notes about the appointment.
  - Constraints: None

### Constraints

- **Primary Key**: `appointment_id`
- **Foreign Key**: `doctor_id` references `doctors(user_id)`
  - **On Update**: Cascade
  - **On Delete**: Set Null
- **Foreign Key**: `patient_id` references `patients(user_id)`
  - **On Update**: Cascade
  - **On Delete**: Set Null