
BEGIN;
-- Inserting test data into the specializations_to_organs table
INSERT INTO specializations_to_organs (specialization_id, organ_id) VALUES
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

COMMIT;
