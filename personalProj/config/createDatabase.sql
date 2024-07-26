CREATE TYPE sex AS ENUM ('M', 'F');

CREATE TABLE IF NOT EXISTS users
(
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name character varying COLLATE pg_catalog."default",
    last_name character varying COLLATE pg_catalog."default",
    age integer,
    sex sex_type,
    pass character varying COLLATE pg_catalog."default" NOT NULL,
    phone character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (user_id),
    CONSTRAINT phone_unique UNIQUE (phone)
)

CREATE TABLE IF NOT EXISTS public.refresh_tokens
(
    user_id uuid NOT NULL,
    refresh_token character varying COLLATE pg_catalog."default",
    expires_at timestamp with time zone,
    CONSTRAINT refresh_token_pkey PRIMARY KEY (user_id),
    CONSTRAINT "user_FK" FOREIGN KEY (user_id)
        REFERENCES public.users (user_id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)


CREATE TABLE IF NOT EXISTS public.patients
(
    user_id uuid NOT NULL,
    insurance_number character varying COLLATE pg_catalog."default",
    insurance_provider character varying COLLATE pg_catalog."default",
    CONSTRAINT patients_pkey PRIMARY KEY (user_id),
    CONSTRAINT "user_FK" FOREIGN KEY (user_id)
        REFERENCES public.users (user_id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE SET NULL
)

CREATE TABLE IF NOT EXISTS public.symptoms
(
    symptom_id integer NOT NULL DEFAULT nextval('symptoms_symptom_id_seq'::regclass),
    symptom_name character varying COLLATE pg_catalog."default" NOT NULL,
    symptom_description text COLLATE pg_catalog."default",
    CONSTRAINT symptoms_pkey PRIMARY KEY (symptom_id)
)

CREATE TABLE IF NOT EXISTS public.organs
(
    organ_id integer NOT NULL DEFAULT nextval('organs_organ_id_seq'::regclass),
    organ_name character varying COLLATE pg_catalog."default" NOT NULL,
    organ_description text COLLATE pg_catalog."default",
    CONSTRAINT organs_pkey PRIMARY KEY (organ_id)
)

CREATE TABLE IF NOT EXISTS public.specializations
(
    specialization_id integer NOT NULL DEFAULT nextval('specializations_specialization_id_seq'::regclass),
    specialization_name character varying COLLATE pg_catalog."default" NOT NULL,
    specialization_description text COLLATE pg_catalog."default",
    CONSTRAINT specializations_pkey PRIMARY KEY (specialization_id)
)

CREATE TABLE IF NOT EXISTS public.specializations_to_symptoms
(
    record_id integer NOT NULL DEFAULT nextval('specializations_to_symptoms_record_id_seq'::regclass),
    specialization_id integer NOT NULL,
    symptom_id integer NOT NULL,
    CONSTRAINT specializations_to_symptoms_pkey PRIMARY KEY (record_id),
    CONSTRAINT "specialization_FK" FOREIGN KEY (specialization_id)
        REFERENCES public.specializations (specialization_id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT "symptom_FK" FOREIGN KEY (symptom_id)
        REFERENCES public.symptoms (symptom_id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

CREATE TABLE IF NOT EXISTS public.specializations_to_organs
(
    record_id integer NOT NULL DEFAULT nextval('specializations_to_organs_record_id_seq'::regclass),
    specialization_id integer NOT NULL,
    organ_id integer NOT NULL,
    CONSTRAINT specializations_to_organs_pkey PRIMARY KEY (record_id),
    CONSTRAINT "organ_FK" FOREIGN KEY (organ_id)
        REFERENCES public.organs (organ_id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT "specialization_FK" FOREIGN KEY (specialization_id)
        REFERENCES public.specializations (specialization_id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

CREATE TABLE IF NOT EXISTS public.doctors
(
    user_id uuid NOT NULL,
    specialization_id integer NOT NULL,
    patient_load smallint NOT NULL DEFAULT 1,
    workday_start time without time zone,
    workday_end time without time zone,
    CONSTRAINT doctors_pkey PRIMARY KEY (user_id),
    CONSTRAINT "specialization_FK" FOREIGN KEY (specialization_id)
        REFERENCES public.specializations (specialization_id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE SET NULL,
    CONSTRAINT "user_FK" FOREIGN KEY (user_id)
        REFERENCES public.users (user_id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
        NOT VALID
)

CREATE TABLE IF NOT EXISTS public.appointments
(
    appointment_id integer NOT NULL DEFAULT nextval('appointments_appointment_id_seq'::regclass),
    patient_id uuid,
    doctor_id uuid,
    appointment_time timestamp without time zone NOT NULL,
    appointment_duration interval NOT NULL,
    additional_info text COLLATE pg_catalog."default",
    CONSTRAINT appointments_pkey PRIMARY KEY (appointment_id),
    CONSTRAINT "doctor_FK" FOREIGN KEY (doctor_id)
        REFERENCES public.doctors (user_id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE SET NULL,
    CONSTRAINT "patieint_FK" FOREIGN KEY (patient_id)
        REFERENCES public.patients (user_id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE SET NULL
)

