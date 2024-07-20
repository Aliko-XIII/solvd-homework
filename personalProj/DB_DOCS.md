# Database Table Documentation

## Table: public.users

### Description
This table stores user information including personal details, contact information, and unique identifiers.

### Columns

- **user_id** (`uuid`): 
  - Description: A unique identifier for each user. 
  - Default: `gen_random_uuid()`
  - Constraints: Primary Key

- **first_name** (`character varying`): 
  - Description: The first name of the user.
  - Constraints: None

- **last_name** (`character varying`): 
  - Description: The last name of the user.
  - Constraints: None

- **age** (`integer`): 
  - Description: The age of the user.
  - Constraints: None

- **sex** (`sex_type`): 
  - Description: The sex of the user.
  - Constraints: None

- **pass** (`character varying`): 
  - Description: The password for the user account.
  - Constraints: Not Null

- **phone** (`character varying`): 
  - Description: The phone number of the user.
  - Constraints: Not Null, Unique

### Constraints

- **Primary Key**: `user_id`
- **Unique**: `phone`

 
## Table: public.patients

### Description
This table stores patient information, linking each patient to a user and storing insurance details.

### Columns

- **user_id** (`uuid`): 
  - Description: A unique identifier linking the patient to a user in the `public.users` table.
  - Constraints: Primary Key, Foreign Key referencing `public.users(user_id)`

- **insurance_number** (`character varying`): 
  - Description: The insurance number of the patient.
  - Constraints: None

- **insurance_provider** (`character varying`): 
  - Description: The insurance provider of the patient.
  - Constraints: None

### Constraints

- **Primary Key**: `user_id`
- **Foreign Key**: `user_id` references `public.users(user_id)`
  - **On Update**: Cascade
  - **On Delete**: Set Null


## Table: public.symptoms

### Description
This table stores information about various symptoms, including their names and descriptions.

### Columns

- **symptom_id** (`integer`): 
  - Description: A unique identifier for each symptom.
  - Default: `nextval('symptoms_symptom_id_seq'::regclass)`
  - Constraints: Primary Key

- **symptom_name** (`character varying`): 
  - Description: The name of the symptom.
  - Constraints: Not Null

- **symptom_description** (`text`): 
  - Description: A description of the symptom.
  - Constraints: None

### Constraints

- **Primary Key**: `symptom_id`

## Table: public.organs

### Description
This table stores information about various organs, including their names and descriptions.

### Columns

- **organ_id** (`integer`): 
  - Description: A unique identifier for each organ, generated automatically in a sequential order.
  - Default: `nextval('organs_organ_id_seq'::regclass)`
  - Constraints: Primary Key, Serial

- **organ_name** (`character varying`): 
  - Description: The name of the organ.
  - Constraints: Not Null

- **organ_description** (`text`): 
  - Description: A description of the organ.
  - Constraints: None

### Constraints

- **Primary Key**: `organ_id`

## Table: public.specializations

### Description
This table stores information about various medical specializations, including their names and descriptions.

### Columns

- **specialization_id** (`integer`): 
  - Description: A unique identifier for each specialization, generated automatically in a sequential order.
  - Default: `nextval('specializations_specialization_id_seq'::regclass)`
  - Constraints: Primary Key, Serial

- **specialization_name** (`character varying`): 
  - Description: The name of the specialization.
  - Constraints: Not Null

- **specialization_description** (`text`): 
  - Description: A description of the specialization.
  - Constraints: None

### Constraints

- **Primary Key**: `specialization_id`

## Table: public.specializations_to_symptoms

### Description
This table links medical specializations to symptoms, indicating which symptoms are associated with each specialization.

### Columns

- **record_id** (`integer`): 
  - Description: A unique identifier for each record, generated automatically in a sequential order.
  - Default: `nextval('specializations_to_symptoms_record_id_seq'::regclass)`
  - Constraints: Primary Key, Serial

- **specialization_id** (`integer`): 
  - Description: The identifier for the specialization.
  - Constraints: Not Null, Foreign Key referencing `public.specializations(specialization_id)`

- **symptom_id** (`integer`): 
  - Description: The identifier for the symptom.
  - Constraints: Not Null, Foreign Key referencing `public.symptoms(symptom_id)`

### Constraints

- **Primary Key**: `record_id`
- **Foreign Key**: `specialization_id` references `public.specializations(specialization_id)`
  - **On Update**: Cascade
  - **On Delete**: Cascade
- **Foreign Key**: `symptom_id` references `public.symptoms(symptom_id)`
  - **On Update**: Cascade
  - **On Delete**: Cascade

## Table: public.specializations_to_organs

### Description
This table links medical specializations to organs, indicating which organs are associated with each specialization.

### Columns

- **record_id** (`integer`): 
  - Description: A unique identifier for each record, generated automatically in a sequential order.
  - Default: `nextval('specializations_to_organs_record_id_seq'::regclass)`
  - Constraints: Primary Key, Serial

- **specialization_id** (`integer`): 
  - Description: The identifier for the specialization.
  - Constraints: Not Null, Foreign Key referencing `public.specializations(specialization_id)`

- **organ_id** (`integer`): 
  - Description: The identifier for the organ.
  - Constraints: Not Null, Foreign Key referencing `public.organs(organ_id)`

### Constraints

- **Primary Key**: `record_id`
- **Foreign Key**: `specialization_id` references `public.specializations(specialization_id)`
  - **On Update**: Cascade
  - **On Delete**: Cascade
- **Foreign Key**: `organ_id` references `public.organs(organ_id)`
  - **On Update**: Cascade
  - **On Delete**: Cascade

## Table: public.doctors

### Description
This table stores information about doctors, including their specialization, patient load, and work schedule.

### Columns

- **user_id** (`uuid`): 
  - Description: A unique identifier for each doctor, linked to a user in the `public.users` table.
  - Constraints: Primary Key, Foreign Key referencing `public.users(user_id)`

- **specialization_id** (`integer`): 
  - Description: The identifier for the doctor's specialization.
  - Constraints: Not Null, Foreign Key referencing `public.specializations(specialization_id)`

- **patient_load** (`smallint`): 
  - Description: The current load of patients assigned to the doctor.
  - Default: `1`
  - Constraints: Not Null

- **workday_start** (`time without time zone`): 
  - Description: The start time of the doctor's workday.
  - Constraints: None

- **workday_end** (`time without time zone`): 
  - Description: The end time of the doctor's workday.
  - Constraints: None

### Constraints

- **Primary Key**: `user_id`
- **Foreign Key**: `specialization_id` references `public.specializations(specialization_id)`
  - **On Update**: Cascade
  - **On Delete**: Set Null

## Table: public.appointments

### Description
This table stores information about appointments between patients and doctors, including scheduling details and additional information.

### Columns

- **appointment_id** (`integer`): 
  - Description: A unique identifier for each appointment, generated automatically in a sequential order.
  - Default: `nextval('appointments_appointment_id_seq'::regclass)`
  - Constraints: Primary Key, Serial

- **patient_id** (`uuid`): 
  - Description: The unique identifier for the patient associated with the appointment.
  - Constraints: Foreign Key referencing `public.patients(user_id)`

- **doctor_id** (`uuid`): 
  - Description: The unique identifier for the doctor associated with the appointment.
  - Constraints: Foreign Key referencing `public.doctors(user_id)`

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
- **Foreign Key**: `doctor_id` references `public.doctors(user_id)`
  - **On Update**: Cascade
  - **On Delete**: Set Null
- **Foreign Key**: `patient_id` references `public.patients(user_id)`
  - **On Update**: Cascade
  - **On Delete**: Set Null

## Table: public.appointments_to_symptoms

### Description
This table links appointments to symptoms, indicating which symptoms are associated with each appointment.

### Columns

- **record_id** (`integer`): 
  - Description: A unique identifier for each record, generated automatically in a sequential order.
  - Default: `nextval('appointments_to_symptoms_record_id_seq'::regclass)`
  - Constraints: Primary Key, Serial

- **appointment_id** (`integer`): 
  - Description: The identifier for the appointment.
  - Constraints: Not Null, Foreign Key referencing `public.appointments(appointment_id)`

- **symptom_id** (`integer`): 
  - Description: The identifier for the symptom.
  - Constraints: Not Null, Foreign Key referencing `public.symptoms(symptom_id)`

### Constraints

- **Primary Key**: `record_id`
- **Foreign Key**: `appointment_id` references `public.appointments(appointment_id)`
  - **On Update**: Cascade
  - **On Delete**: Cascade
- **Foreign Key**: `symptom_id` references `public.symptoms(symptom_id)`
  - **On Update**: Cascade
  - **On Delete**: Cascade
