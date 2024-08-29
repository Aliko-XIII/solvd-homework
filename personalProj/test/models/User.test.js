
const { User } = require('../../models/User');
const { query } = require('../../config/database');

// Mock the query method
jest.mock('../../config/database', () => ({
    query: jest.fn(),
}));

describe('User Class', () => {
    describe('User constructor', () => {
        test('should create a valid User instance', () => {
            const user = new User('John', 'Doe', '123456789', 'password', 30, 'M');
            expect(user.firstName).toBe('John');
            expect(user.lastName).toBe('Doe');
            expect(user.phone).toBe('123456789');
            expect(user.age).toBe(30);
            expect(user.sex).toBe('M');
        });

        test('should throw error for invalid first name', () => {
            expect(() => new User('', 'Doe', '123456789', 'password', 30, 'M')).toThrow(Error);
        });

        test('should throw error for invalid last name', () => {
            expect(() => new User('John', '', '123456789', 'password', 30, 'M')).toThrow(Error);
        });

        test('should throw error for invalid phone number', () => {
            expect(() => new User('John', 'Doe', '', 'password', 30, 'M')).toThrow(Error);
        });
        test('should throw error for invalid password', () => {
            expect(() => new User('John', 'Doe', '123456789', '', 30, 'M')).toThrow(Error);
        });
        test('should throw error for invalid age (non-number)', () => {
            expect(() => new User('John', 'Doe', '123456789', 'password', 'thirty', 'M')).toThrow(Error);
        });
        test('should throw error for invalid age (zero or negative)', () => {
            expect(() => new User('John', 'Doe', '123456789', 'password', 0, 'M')).toThrow(Error);
        });
        test('should throw error for invalid sex', () => {
            expect(() => new User('John', 'Doe', '123456789', 'password', 30, 'X')).toThrow(Error);
        });

        test('should throw error for invalid user ID', () => {
            expect(() => new User('John', 'Doe', '123456789', 'password', 30, 'M', 123)).toThrow(Error);
        });
    });

    describe('Get users array from DB recors', () => {
        test('should return array of User objects', async () => {
            const users = await User.getUsersFromData([
                {
                    first_name: "John",
                    last_name: "Doe",
                    phone: "123-456-7890",
                    pass: "password123",
                    age: 30,
                    sex: "M",
                    user_id: "user1"
                },
                {
                    first_name: "Jane",
                    last_name: "Smith",
                    phone: "098-765-4321",
                    pass: "securepass",
                    age: 25,
                    sex: "F",
                    user_id: "user2"
                },
                {
                    first_name: "Alice",
                    last_name: "Johnson",
                    phone: "555-555-5555",
                    pass: "alicepass",
                    age: 28,
                    sex: "F",
                    user_id: "user3"
                },
                {
                    first_name: "Bob",
                    last_name: "Brown",
                    phone: "444-444-4444",
                    pass: "bobpassword",
                    age: 35,
                    sex: "M",
                    user_id: "user4"
                },
                {
                    first_name: "Charlie",
                    last_name: "Davis",
                    phone: "333-333-3333",
                    pass: "charlie123",
                    age: 40,
                    sex: "M",
                    user_id: "user5"
                }
            ]);
            expect(users).toBeInstanceOf(Array);
            users.forEach(user => {
                expect(user).toBeInstanceOf(User);
            });
        });
    });

    describe('Insert a user to DB', () => {
        test('should insert a new user', async () => {
            query.mockResolvedValue({
              rows: [{ user_id: '3' }],
            });
      
            const user = new User('Jane', 'Smith', '5551234', 'password', 22, 'F');
            const { id } = await user.insertUser();
      
            expect(query).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO users'));
            expect(id).toBe('3');
            expect(user.id).toBe('3');
          });
    });

    describe('Get user by id from DB', () => {
        test('should return a user by ID', async () => {
            query.mockResolvedValue({
                rows: [
                    { first_name: 'Jane', last_name: 'Doe', phone: '987654321', age: 25, sex: 'F', user_id: '2', pass: 'password' },
                ],
            });

            const user = await User.getUserById('2');
            expect(user).toBeInstanceOf(User);
            expect(user.firstName).toBe('Jane');
        });
    });

    describe('Get all users from DB', () => {
        test('should call query with proper filters', async () => {
            query.mockResolvedValue({ rows: [] });
            await User.getUsers({ firstName: 'John', sex: 'M' });

            expect(query).toHaveBeenCalledWith(expect.stringContaining("first_name ILIKE '%John%'"));
            expect(query).toHaveBeenCalledWith(expect.stringContaining("sex = 'M'"));
        });

        test('should return an array of User instances', async () => {
            query.mockResolvedValue({
                rows: [
                    { first_name: 'John', last_name: 'Doe', phone: '123456789', age: 30, sex: 'M', user_id: '1', pass: 'password' },
                ],
            });

            const users = await User.getUsers();
            expect(users).toHaveLength(1);
            expect(users[0]).toBeInstanceOf(User);
            expect(users[0].firstName).toBe('John');
            expect(users[0].password).toBeUndefined();
        });
    });

    describe('Update user by id in DB', () => {
        test('should throw an error if no updates are provided', async () => {
            await expect(User.updateUser('1', {})).rejects.toThrow('There are no params to update.');
        });

        test('should update user information', async () => {
            query.mockResolvedValue({
                rows: [
                    { first_name: 'John', last_name: 'Doe', phone: '123456789', age: 31, sex: 'M', user_id: '1', pass: 'password' },
                ],
            });

            const updatedUser = await User.updateUser('1', { age: 31 });
            expect(query).toHaveBeenCalledWith(expect.stringContaining('UPDATE users SET'));
            expect(updatedUser.age).toBe(31);
            expect(updatedUser.password).toBeUndefined();
        });

    });

    describe('Delete user from DB', () => {
        test('should delete a user', async () => {
            query.mockResolvedValue({
                rows: [{ user_id: '1' }],
            });

            const user = new User('John', 'Doe', '123456789', 'password', 30, 'M', '1');
            await user.deleteUser();

            expect(query).toHaveBeenCalledWith(expect.stringContaining("DELETE FROM users WHERE user_id = '1'"));
        });
    });
});