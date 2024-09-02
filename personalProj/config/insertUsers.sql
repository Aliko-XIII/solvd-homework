BEGIN;
-- Inserting test data into the users table
INSERT INTO users (first_name, last_name, age, sex, pass, phone) VALUES
('John', 'Doe', 30, 'M', 'securePass123', '1234567890'),
('Jane', 'Smith', 25, 'F', 'password123', '0987654321'),
('Alice', 'Johnson', 40, 'F', 'MySecretPassword1', '1122334455'),
('Bob', 'Brown', 35, 'M', 'b0bPass!23', '2233445566'),
('Emily', 'Davis', 28, 'F', 'eM1lyPass!', '3344556677'),
('Michael', 'Wilson', 50, 'M', 'M1chaelP@ss', '4455667788'),
('Sophia', 'Miller', 32, 'F', 'S0ph1a#Pass', '5566778899'),
('James', 'Taylor', 45, 'M', 'James2024!', '6677889900'),
('Olivia', 'Anderson', 29, 'F', '0l1via!Pass', '7788990011'),
('William', 'Thomas', 60, 'M', 'W1ll!amPass', '8899001122') 
ON CONFLICT (phone) DO NOTHING;

COMMIT;
