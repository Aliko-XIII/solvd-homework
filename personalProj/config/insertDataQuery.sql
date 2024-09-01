INSERT INTO organs (organ_name, organ_description) VALUES
('Heart', 'Responsible for pumping blood throughout the body.'),
('Liver', 'Filters toxins from the blood and produces bile.'),
('Kidney', 'Removes waste and extra fluid from the body.'),
('Lung', 'Allows oxygen to enter the body and removes carbon dioxide.'),
('Brain', 'Controls most of the activities of the body.'),
('Stomach', 'Breaks down food into a digestible form.'),
('Pancreas', 'Regulates blood sugar by producing insulin.'),
('Spleen', 'Helps fight infections and filter old blood cells.'),
('Small Intestine', 'Absorbs nutrients and minerals from food.'),
('Large Intestine', 'Absorbs water and forms waste for excretion.'),
('Esophagus', 'Carries food and liquid from the mouth to the stomach.'),
('Gallbladder', 'Stores bile produced by the liver.'),
('Bladder', 'Stores urine before it is excreted from the body.'),
('Prostate', 'Produces fluid that nourishes and transports sperm.'),
('Thyroid', 'Regulates metabolism by producing thyroid hormones.'),
('Adrenal Gland', 'Produces hormones like adrenaline and cortisol.'),
('Appendix', 'A small organ attached to the large intestine, with a debated function.'),
('Pituitary Gland', 'The master gland that controls other endocrine glands and many bodily functions.'),
('Uterus', 'Houses and nourishes a fetus during pregnancy.'),
('Ovaries', 'Produces eggs and reproductive hormones.'),
('Testes', 'Produces sperm and testosterone.'),
('Thymus', 'Plays a role in the development of the immune system during childhood.');


-- Inserting test data into the symptoms table
INSERT INTO public.symptoms (symptom_name, symptom_description) VALUES
('Fever', 'An elevated body temperature, usually a sign of infection.'),
('Cough', 'A reflex action to clear the airways of mucus or irritants.'),
('Headache', 'A continuous pain in the head, can be a symptom of many conditions.'),
('Fatigue', 'A feeling of extreme tiredness and lack of energy.'),
('Nausea', 'An unpleasant sensation in the stomach often leading to vomiting.'),
('Shortness of breath', 'Difficulty breathing or feeling winded.'),
('Sore throat', 'Pain or irritation in the throat.'),
('Dizziness', 'A sensation of spinning or losing balance.'),
('Chest Pain', 'A feeling of discomfort or pain in the chest area.'),
('Abdominal Pain', 'Pain or discomfort in the stomach or abdominal region.'),
('Back Pain', 'A common symptom involving discomfort in the lower or upper back.'),
('Rash', 'A change in skin color or texture, often a sign of infection or allergy.'),
('Swelling', 'An abnormal enlargement of a body part, often due to inflammation.'),
('Blurred Vision', 'Difficulty seeing clearly, often caused by eye or neurological issues.'),
('Weight Loss', 'A significant loss of body weight without trying, potentially indicating an underlying condition.'),
('Weight Gain', 'Unexpected weight gain, often related to hormonal imbalances or other conditions.'),
('Muscle Weakness', 'A reduction in muscle strength, often due to neurological or muscular conditions.'),
('Joint Pain', 'Discomfort in the joints, a common sign of arthritis or injury.'),
('Confusion', 'Difficulty in thinking clearly or processing information.'),
('Sweating', 'Excessive perspiration, which may be a sign of infection, stress, or other conditions.'),
('Numbness', 'Loss of sensation in a part of the body, often due to nerve damage.'),
('Tremors', 'Involuntary shaking or trembling, often a sign of neurological disorders.'),
('Palpitations', 'An abnormal awareness of the heartbeat, often felt as rapid or irregular.'),
('Insomnia', 'Difficulty falling or staying asleep, which can be a symptom of mental or physical health issues.'),
('Anxiety', 'Feelings of worry or fear, often accompanied by physical symptoms like restlessness or rapid heartbeat.'),
('Loss of Appetite', 'A reduced desire to eat, often associated with illness or stress.');



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


-- Inserting test data into the specializations_to_organs table
INSERT INTO public.specializations_to_organs (specialization_id, organ_id) VALUES
-- Cardiology
(1, 1),  -- Heart
(1, 2),  -- Liver (as it relates to overall cardiovascular health)
(1, 17), -- Adrenal Gland (produces hormones affecting heart function)

-- Neurology
(2, 5),  -- Brain
(2, 17), -- Adrenal Gland (impacts brain function through hormone production)
(2, 18), -- Pituitary Gland (regulates brain function through hormone control)

-- Orthopedics
(3, 3),  -- Kidney (relevant for bone health and metabolism)
(3, 8),  -- Spleen (indirectly relevant to bone health)

-- Pediatrics
(4, 1),  -- Heart
(4, 5),  -- Brain
(4, 18), -- Pituitary Gland
(4, 19), -- Uterus (important for reproductive health in adolescents)

-- Dermatology
(5, 12), -- Skin (part of the organs list)
(5, 11), -- Large Intestine (related to skin conditions due to digestion)

-- Ophthalmology
(6, 5),  -- Brain (linked with vision processing)
(6, 11), -- Large Intestine (impacts overall health, indirectly affecting eyes)

-- Psychiatry
(7, 5),  -- Brain
(7, 18), -- Pituitary Gland

-- Oncology
(8, 1),  -- Heart
(8, 2),  -- Liver
(8, 3),  -- Kidney
(8, 4),  -- Lung
(8, 5),  -- Brain
(8, 8),  -- Spleen

-- Gastroenterology
(9, 6),  -- Stomach
(9, 9),  -- Small Intestine
(9, 10), -- Large Intestine
(9, 12), -- Gallbladder

-- Hematology
(10, 2), -- Liver (produces blood-clotting factors)
(10, 8), -- Spleen (filters old blood cells)

-- Infectious Diseases
(11, 1), -- Heart
(11, 4), -- Lung
(11, 6), -- Stomach
(11, 12), -- Gallbladder

-- Rheumatology
(12, 3), -- Kidney
(12, 11), -- Large Intestine

-- Endocrinology
(13, 5), -- Brain
(13, 17), -- Adrenal Gland
(13, 18), -- Pituitary Gland
(13, 19), -- Uterus (relevant for reproductive hormones)

-- Nephrology
(14, 3), -- Kidney
(14, 1), -- Heart (affects kidney function)

-- Pulmonology
(15, 4), -- Lung
(15, 11), -- Large Intestine

-- Geriatrics
(16, 1), -- Heart
(16, 2), -- Liver
(16, 3), -- Kidney
(16, 4), -- Lung

-- Obstetrics
(17, 19), -- Uterus
(17, 20), -- Ovaries

-- Urology
(18, 3), -- Kidney
(18, 13), -- Bladder
(18, 14), -- Prostate

-- Otolaryngology
(19, 11), -- Large Intestine (impacts throat and mouth health)
(19, 9),  -- Small Intestine (related to throat and mouth health)

-- Allergy and Immunology
(20, 8), -- Spleen
(20, 12), -- Skin

-- Emergency Medicine
(21, 1), -- Heart
(21, 4), -- Lung
(21, 6), -- Stomach
(21, 3), -- Kidney
(21, 13), -- Bladder

-- Physical Medicine and Rehabilitation
(22, 3), -- Kidney
(22, 8), -- Spleen
(22, 18), -- Pituitary Gland

-- Sports Medicine
(23, 1), -- Heart
(23, 3), -- Kidney
(23, 8), -- Spleen

-- Vascular Surgery
(24, 1), -- Heart
(24, 4), -- Lung

-- Plastic Surgery
(25, 12); -- Skin


-- Inserting test data into the users table
INSERT INTO public.users (first_name, last_name, age, sex, pass, phone) VALUES
('John', 'Doe', 30, 'M', 'securePass123', '1234567890'),
('Jane', 'Smith', 25, 'F', 'password123', '0987654321'),
('Alice', 'Johnson', 40, 'F', 'MySecretPassword1', '1122334455'),
('Bob', 'Brown', 35, 'M', 'b0bPass!23', '2233445566'),
('Emily', 'Davis', 28, 'F', 'eM1lyPass!', '3344556677'),
('Michael', 'Wilson', 50, 'M', 'M1chaelP@ss', '4455667788'),
('Sophia', 'Miller', 32, 'F', 'S0ph1a#Pass', '5566778899'),
('James', 'Taylor', 45, 'M', 'James2024!', '6677889900'),
('Olivia', 'Anderson', 29, 'F', '0l1via!Pass', '7788990011'),
('William', 'Thomas', 60, 'M', 'W1ll!amPass', '8899001122');

-- Insert patients using phone numbers to select user_id and provide dummy insurance data
INSERT INTO public.patients (user_id, insurance_number, insurance_provider)
SELECT user_id, 'INS001', 'HealthCare Inc.'
FROM public.users
WHERE phone = '1234567890'  -- John Doe
UNION ALL
SELECT user_id, 'INS002', 'Wellness Plus'
FROM public.users
WHERE phone = '0987654321'  -- Jane Smith
UNION ALL
SELECT user_id, 'INS003', 'MedCoverage'
FROM public.users
WHERE phone = '1122334455'  -- Alice Johnson
UNION ALL
SELECT user_id, 'INS004', 'CareFirst'
FROM public.users
WHERE phone = '2233445566'  -- Bob Brown
UNION ALL
SELECT user_id, 'INS005', 'Family Health'
FROM public.users
WHERE phone = '3344556677'  -- Emily Davis
UNION ALL
SELECT user_id, 'INS006', 'LifeCare'
FROM public.users
WHERE phone = '4455667788'  -- Michael Wilson
UNION ALL
SELECT user_id, 'INS007', 'Optima Health'
FROM public.users
WHERE phone = '5566778899'  -- Sophia Miller
UNION ALL
SELECT user_id, 'INS008', 'PrimeCare'
FROM public.users
WHERE phone = '6677889900'  -- James Taylor
UNION ALL
SELECT user_id, 'INS009', 'Elite Health'
FROM public.users
WHERE phone = '7788990011'  -- Olivia Anderson
UNION ALL
SELECT user_id, 'INS010', 'Complete Health'
FROM public.users
WHERE phone = '8899001122';  -- William Thomas

-- Insert doctors with sample data
INSERT INTO public.doctors (user_id, specialization_id, patient_load, workday_start, workday_end)
SELECT user_id, 1, 20, '09:00:00', '17:00:00'  -- Cardiologist
FROM public.users
WHERE phone = '1234567890'  -- John Doe
UNION ALL
SELECT user_id, 2, 15, '09:00:00', '17:00:00'  -- Neurologist
FROM public.users
WHERE phone = '0987654321'  -- Jane Smith
UNION ALL
SELECT user_id, 3, 10, '09:00:00', '17:00:00'  -- Orthopedist
FROM public.users
WHERE phone = '1122334455'  -- Alice Johnson
UNION ALL
SELECT user_id, 4, 12, '09:00:00', '17:00:00'  -- Pediatrician
FROM public.users
WHERE phone = '2233445566'  -- Bob Brown
UNION ALL
SELECT user_id, 5, 8, '09:00:00', '17:00:00'   -- Dermatologist
FROM public.users
WHERE phone = '3344556677';  -- Emily Davis



