
BEGIN;
-- Inserting test data into the specializations table
INSERT INTO public.specializations (specialization_name, specialization_description) VALUES
('Cardiology', 'Specializes in heart and blood vessel disorders.'),
('Neurology', 'Focuses on disorders of the nervous system.'),
('Orthopedics', 'Deals with conditions involving the musculoskeletal system.'),
('Pediatrics', 'Specializes in the medical care of infants, children, and adolescents.'),
('Dermatology', 'Focuses on skin, hair, and nail disorders.'),
('Ophthalmology', 'Specializes in the diagnosis and treatment of eye disorders.'),
('Psychiatry', 'Deals with the diagnosis, treatment, and prevention of mental health disorders.'),
('Oncology', 'Specializes in the diagnosis and treatment of cancer.'),
('Gastroenterology', 'Focuses on the digestive system and its disorders.'),
('Hematology', 'Specializes in blood diseases and disorders.'),
('Infectious Diseases', 'Deals with diseases caused by bacteria, viruses, fungi, and parasites.'),
('Rheumatology', 'Focuses on autoimmune and inflammatory conditions affecting the joints and muscles.'),
('Endocrinology', 'Specializes in hormonal and glandular conditions, including diabetes and thyroid disorders.'),
('Nephrology', 'Deals with kidney function and kidney diseases.'),
('Pulmonology', 'Specializes in respiratory system disorders, including lungs and airways.'),
('Geriatrics', 'Focuses on the health care of elderly people.'),
('Obstetrics', 'Deals with pregnancy, childbirth, and the postpartum period.'),
('Urology', 'Specializes in the urinary tract and male reproductive organs.'),
('Otolaryngology', 'Focuses on conditions of the ear, nose, and throat (ENT).'),
('Allergy and Immunology', 'Specializes in allergic reactions and immune system disorders.'),
('Emergency Medicine', 'Focuses on the treatment of urgent and emergency conditions.'),
('Physical Medicine and Rehabilitation', 'Deals with restoring function and quality of life for patients with physical impairments.'),
('Sports Medicine', 'Focuses on the treatment and prevention of sports-related injuries and conditions.'),
('Vascular Surgery', 'Specializes in the treatment of diseases of the vascular system, including arteries and veins.'),
('Plastic Surgery', 'Deals with the reconstruction and aesthetic improvement of physical appearance.');

COMMIT;
