
-- Inserting test data into the specializations_to_symptoms table
INSERT INTO public.specializations_to_symptoms (specialization_id, symptom_id) VALUES
-- Cardiology
(1, 9),  -- Chest Pain
(1, 22), -- Palpitations

-- Neurology
(2, 3),  -- Headache
(2, 16), -- Blurred Vision
(2, 17), -- Muscle Weakness
(2, 19), -- Confusion
(2, 22), -- Palpitations
(2, 24), -- Insomnia

-- Orthopedics
(3, 11), -- Back Pain
(3, 18), -- Joint Pain

-- Pediatrics
(4, 1),  -- Fever
(4, 4),  -- Fatigue
(4, 5),  -- Nausea
(4, 12), -- Rash

-- Dermatology
(5, 12), -- Rash
(5, 13), -- Swelling
(5, 14), -- Blurred Vision

-- Ophthalmology
(6, 14), -- Blurred Vision
(6, 22), -- Palpitations

-- Psychiatry
(7, 24), -- Insomnia
(7, 25), -- Anxiety
(7, 19), -- Confusion

-- Oncology
(8, 9),  -- Chest Pain
(8, 11), -- Back Pain
(8, 16), -- Weight Loss

-- Gastroenterology
(9, 5),  -- Nausea
(9, 10), -- Abdominal Pain
(9, 16), -- Weight Loss

-- Hematology
(10, 10), -- Abdominal Pain
(10, 12), -- Rash

-- Infectious Diseases
(11, 1),  -- Fever
(11, 5),  -- Nausea
(11, 12), -- Rash

-- Rheumatology
(12, 18), -- Joint Pain
(12, 11), -- Back Pain

-- Endocrinology
(13, 16), -- Weight Loss
(13, 17), -- Muscle Weakness
(13, 25), -- Anxiety

-- Nephrology
(14, 10), -- Abdominal Pain
(14, 17), -- Muscle Weakness

-- Pulmonology
(15, 6),  -- Shortness of breath
(15, 9),  -- Chest Pain

-- Geriatrics
(16, 4),  -- Fatigue
(16, 24), -- Insomnia

-- Obstetrics
(17, 1),  -- Fever
(17, 4),  -- Fatigue
(17, 5),  -- Nausea

-- Urology
(18, 10), -- Abdominal Pain
(18, 6),  -- Shortness of breath

-- Otolaryngology
(19, 7),  -- Sore throat
(19, 8),  -- Dizziness
(19, 6),  -- Shortness of breath

-- Allergy and Immunology
(20, 12), -- Rash
(20, 13), -- Swelling

-- Emergency Medicine
(21, 1),  -- Fever
(21, 9),  -- Chest Pain
(21, 6),  -- Shortness of breath

-- Physical Medicine and Rehabilitation
(22, 17), -- Muscle Weakness
(22, 18), -- Joint Pain

-- Sports Medicine
(23, 18), -- Joint Pain
(23, 17), -- Muscle Weakness

-- Vascular Surgery
(24, 9),  -- Chest Pain
(24, 6),  -- Shortness of breath

-- Plastic Surgery
(25, 12), -- Rash
(25, 13); -- Swelling



COMMIT;




