-- Create enum type for sex
DO $$
BEGIN
   IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'sex') THEN
      CREATE TYPE sex AS ENUM ('F', 'M');
   END IF;
END$$;

BEGIN;

-- Create users table
CREATE TABLE IF NOT EXISTS users
(
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name character varying,
    last_name character varying,
    age integer,
    sex sex,
    pass character varying NOT NULL,
    phone character varying NOT NULL,
    CONSTRAINT phone_unique UNIQUE (phone),
    CONSTRAINT age_valid CHECK (age >= 0 AND age <= 120),
    CONSTRAINT pass_length CHECK (char_length(pass) > 6 AND char_length(pass) < 32),
    CONSTRAINT phone_length CHECK (char_length(phone) >= 10),
    CONSTRAINT first_name_length CHECK (char_length(first_name) > 0),
    CONSTRAINT last_name_length CHECK (char_length(last_name) > 0)
);

-- Create refresh_tokens table
CREATE TABLE IF NOT EXISTS refresh_tokens
(
    user_id uuid NOT NULL,
    refresh_token character varying,
    expires_at timestamp with time zone,
    CONSTRAINT refresh_token_pkey PRIMARY KEY (user_id),
    CONSTRAINT user_FK FOREIGN KEY (user_id)
        REFERENCES users (user_id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

-- Create patients table
CREATE TABLE IF NOT EXISTS patients
(
    user_id uuid NOT NULL,
    insurance_number character varying,
    insurance_provider character varying,
    CONSTRAINT patients_pkey PRIMARY KEY (user_id),
    CONSTRAINT user_FK FOREIGN KEY (user_id)
        REFERENCES users (user_id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE SET NULL,
    CONSTRAINT insurance_number_length CHECK (char_length(insurance_number) > 0),
    CONSTRAINT insurance_provider_length CHECK (char_length(insurance_provider) > 0)
);

-- Create symptoms table
CREATE TABLE IF NOT EXISTS symptoms
(
    symptom_id serial NOT NULL,
    symptom_name character varying NOT NULL,
    symptom_description text,
    CONSTRAINT symptoms_pkey PRIMARY KEY (symptom_id),
    CONSTRAINT symptom_name_length CHECK (char_length(symptom_name) > 0)
);

-- Create organs table
CREATE TABLE IF NOT EXISTS organs
(
    organ_id serial NOT NULL,
    organ_name character varying NOT NULL,
    organ_description text,
    CONSTRAINT organs_pkey PRIMARY KEY (organ_id),
    CONSTRAINT organ_name_length CHECK (char_length(organ_name) > 0)
);

-- Create specializations table
CREATE TABLE IF NOT EXISTS specializations
(
    specialization_id serial NOT NULL,
    specialization_name character varying NOT NULL,
    specialization_description text,
    CONSTRAINT specializations_pkey PRIMARY KEY (specialization_id),
    CONSTRAINT specialization_name_length CHECK (char_length(specialization_name) > 0)
);

-- Create specializations_to_symptoms table
CREATE TABLE IF NOT EXISTS specializations_to_symptoms
(
    record_id serial NOT NULL,
    specialization_id integer NOT NULL,
    symptom_id integer NOT NULL,
    CONSTRAINT specializations_to_symptoms_pkey PRIMARY KEY (record_id),
    CONSTRAINT specialization_FK FOREIGN KEY (specialization_id)
        REFERENCES specializations (specialization_id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT symptom_FK FOREIGN KEY (symptom_id)
        REFERENCES symptoms (symptom_id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

-- Create specializations_to_organs table
CREATE TABLE IF NOT EXISTS specializations_to_organs
(
    record_id serial NOT NULL,
    specialization_id integer NOT NULL,
    organ_id integer NOT NULL,
    CONSTRAINT specializations_to_organs_pkey PRIMARY KEY (record_id),
    CONSTRAINT organ_FK FOREIGN KEY (organ_id)
        REFERENCES organs (organ_id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT specialization_FK FOREIGN KEY (specialization_id)
        REFERENCES specializations (specialization_id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

-- Create doctors table
CREATE TABLE IF NOT EXISTS doctors
(
    user_id uuid NOT NULL,
    specialization_id integer NOT NULL,
    patient_load smallint NOT NULL DEFAULT 1,
    workday_start time without time zone,
    workday_end time without time zone,
    CONSTRAINT doctors_pkey PRIMARY KEY (user_id),
    CONSTRAINT specialization_FK FOREIGN KEY (specialization_id)
        REFERENCES specializations (specialization_id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE SET NULL,
    CONSTRAINT user_FK FOREIGN KEY (user_id)
        REFERENCES users (user_id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT patient_load_valid CHECK (patient_load > 0),
    CONSTRAINT workday_valid CHECK (workday_start < workday_end)
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments
(
    appointment_id serial NOT NULL,
    patient_id uuid,
    doctor_id uuid,
    appointment_time timestamp without time zone NOT NULL,
    appointment_duration interval NOT NULL,
    additional_info text,
    CONSTRAINT appointments_pkey PRIMARY KEY (appointment_id),
    CONSTRAINT doctor_FK FOREIGN KEY (doctor_id)
        REFERENCES doctors (user_id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE SET NULL,
    CONSTRAINT patient_FK FOREIGN KEY (patient_id)
        REFERENCES patients (user_id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

COMMIT;
