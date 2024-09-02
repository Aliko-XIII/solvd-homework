BEGIN;
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

COMMIT;