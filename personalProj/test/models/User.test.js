const { User } = require('../../models/User');

const userFields = {
    firstName: 'John',
    lastName: 'Black',
    phone: '1324234532',
    password: 'pass1234324',
    age: 25,
    sex: 'M',
    id: 'fsdfsda-23jnrewj1-vdvjdsn132-sdv12'
};
let userId = null;

describe('User constructor', () => {
    const user = new User(userFields.firstName, userFields.lastName, userFields.phone,
        userFields.password, userFields.age, userFields.sex, userFields.id);
    test('should return instance of User', () => {
        expect(user).toBeInstanceOf(User);
    });
    test('should return object with corresponding fields', () => {
        expect(user.firstName).toEqual(userFields.firstName);
        expect(user.lastName).toEqual(userFields.lastName);
        expect(user.phone).toEqual(userFields.phone);
        expect(user.password).toEqual(userFields.password);
        expect(user.age).toEqual(25);
        expect(user.id).toEqual('fsdfsda-23jnrewj1-vdvjdsn132-sdv12');
    });

    test('should throw an error for invalid age', () => {
        expect(() => {
            const userInvalidAge = new User(userFields.firstName, userFields.lastName,
                userFields.phone, userFields.password, -3, userFields.sex, userFields.id);
        }).toThrow(Error);
    });

    test('should throw an error for invalid string fields', () => {
        expect(() => {
            const userInvalidName = new User('', '', userFields.phone, userFields.password,
                userFields.age, userFields.sex, userFields.id);
        }).toThrow(Error);
    });

    test('should throw an error for invalid sex', () => {
        expect(() => {
            const userInvalidSex = new User(userFields.firstName, userFields.lastName,
                userFields.phone, userFields.password, userFields.age, 'Invalid', userFields.id);
        }).toThrow(Error);
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

describe('Get all users from DB', () => {
    test('should return array of User objects', async () => {
        const users = await User.getUsers();
        expect(users).toBeInstanceOf(Array);
        users.forEach(user => {
            expect(user).toBeInstanceOf(User);
        });
    });

    test('should return array with name filter applied', async () => {
        const users = await User.getUsers({ firstName: 'o', lastName: 'a' });
        expect(users).toBeInstanceOf(Array);
        users.forEach(user => {
            expect(user).toBeInstanceOf(User);
            expect(user.firstName.indexOf('o') != -1).toBeTruthy();
            expect(user.lastName.indexOf('a') != -1).toBeTruthy();
        });
    });

    test('should return array with age filter applied', async () => {
        const users = await User.getUsers({ minAge: 20, maxAge: 45 });
        expect(users).toBeInstanceOf(Array);
        users.forEach(user => {
            expect(user).toBeInstanceOf(User);
            expect(user.age >= 20).toBeTruthy();
            expect(user.age <= 45).toBeTruthy();
        });
    });

    test('should return array with sex filter applied', async () => {
        const users = await User.getUsers({ sex: 'M' });
        expect(users).toBeInstanceOf(Array);
        users.forEach(user => {
            expect(user).toBeInstanceOf(User);
            expect(user.sex).toEqual('M');
        });
    });

    test('should return array with phone filter applied', async () => {
        const users = await User.getUsers({ phone: '1' });
        expect(users).toBeInstanceOf(Array);
        users.forEach(user => {
            expect(user).toBeInstanceOf(User);
            expect(user.phone.indexOf('1') != -1).toBeTruthy();
        });
    });
});

describe('Insert a user to DB', () => {
    test('should return an object with user\'s id', async () => {
        const user = new User(userFields.firstName, userFields.lastName, userFields.phone,
            userFields.password, userFields.age, userFields.sex);
        const id = (await user.insertUser()).id;
        userId = id;
        expect(id.length > 0).toBeTruthy();
    });
});

describe('Get user by id from DB', () => {
    test('should return a User object', async () => {
        const user = await User.getUserById(userId);
        expect(user).toBeInstanceOf(User);
        expect(user.id).toEqual(userId);
    });
});

describe('Update user by id in DB', () => {
    test('should return a user with updated name', async () => {
        const updated = await User.updateUser(userId, { firstName: 'testName' });
        expect(updated.firstName).toEqual('testName');
        const user = await User.getUserById(userId);
        expect(user.firstName).toEqual('testName');
    });

    test('should return a user with updated age', async () => {
        const updated = await User.updateUser(userId, { age: 27 });
        expect(updated.age).toEqual(27);
        const user = await User.getUserById(userId);
        expect(user.age).toEqual(27);
    });

});

describe('Remove user from DB', () => {
    test('should remove user from DB', async () => {
        const user = await User.getUserById(userId);
        expect(async () => { await user.deleteUser() }).not.toThrow();
    });
});


