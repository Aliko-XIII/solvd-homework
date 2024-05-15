
/**
 * Represents a base class for books.
 * Provides properties for books.
 */
class Book {
    /**
     * Creates a new instance of the Book class.
     * @param {string} title - The title of the book.
     * @param {string} author - The name of the author of the book.
     * @param {string} isbn - International Standard Book Number of the book.
     * @param {number} price - The price of the book.
     * @param {boolean} availability - The boolean value of wheter the book is available.
     * @param {number} discount - The discount on the current book.
     */
    constructor(title, author, isbn, price = 0, availability = true, discount = 0) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.price = price;
        this.availability = availability;
        this.discount = discount;
    }

    /**
     * Get string representation of the book.
     * @returns {string} The string value represanting book.
     */
    toString() {
        return `Book "${this.title}" by ${this.author} sold for ${this.price * (1 - this.discount)}."`
    }

    // static searchBook(){

    // }
}

/**
 * Represents a subclass of Book for textbooks.
 * Provides additional properties specific to textbooks.
 * @extends {Book}
 */
class TextBook extends Book {
    /**
     * Creates a new instance of the TextBook class.
     * @param {string} title - The title of the book.
     * @param {string} author - The name of the author of the book.
     * @param {string} isbn - International Standard Book Number of the book.
     * @param {number} price - The price of the book.
     * @param {boolean} availability - The boolean value of wheter the book is available.
     * @param {number} grade - The grade for which book is provided.
     */
    constructor(title, author, isbn, grade, price = 0, availability = true, discount = 0) {
        super(title, author, isbn, price, availability);
        this.grade = grade;
        this.discount = discount;
    }

    /**
     * Get string representation of the book.
     * @returns {string} The string value represanting book.
     */
    toString() {
        return `Textbook for ${this.grade} grade "${this.title}" by ${this.author} sold for ${this.price * (1 - this.discount)}."`
    }
}

/**
 * Represents a subclass of Book for fiction books.
 * Provides additional genre property.
 * @extends {Book}
 */
class FictionBook extends Book {
    /**
     * Creates a new instance of the TextBook class.
     * @param {string} title - The title of the book.
     * @param {string} author - The name of the author of the book.
     * @param {string} isbn - International Standard Book Number of the book.
     * @param {number} price - The price of the book.
     * @param {boolean} availability - The boolean value of wheter the book is available.
     * @param {string} genre - The genre of the book.
     */
    constructor(title, author, isbn, genre, price = 0, availability = true, discount = 0) {
        super(title, author, isbn, price, availability);
        this.genre = genre;
        this.discount = discount;
    }

    /**
     * Get string representation of the book.
     * @returns {string} The string value represanting book.
     */
    toString() {
        return `${this.genre} book "${this.title}" by ${this.author} sold for ${this.price * (1 - this.discount)}."`
    }
}

/**
 * Represents a base class for bookstore user.
 * Provides properties for user.
 */
class User {
    /**
     * Creates a new instance of the User class.
     * @param {string} name - The name of the user.
     * @param {string} email - The email of the user.
     * @param {string} userId - The ID of the user in the system.
     * @param {number} discount - The discount for user's orders.
     */
    constructor(name, email, userId, discount = 0) {
        this.name = name;
        this.email = email;
        this.userId = userId;
        this.discount = discount;
    }
}

/**
 * Represents a subclass of User for students.
 * Provides additional properties specific to students.
 * @extends {User}
 */
class StudentUser extends User {
    /**
     * Creates a new instance of the User class.
     * @param {string} name - The name of the user.
     * @param {string} email - The email of the user.
     * @param {string} userId - The ID of the user in the system.
     * @param {number} discount - The discount for user's orders.
     * @param {number} grade - The grade student studies in.
     */
    constructor(name, email, userId, grade, discount = 0) {
        super(name, email, userId, discount);
        this.grade = grade;
        this.discount += 0.2;
    }
}

/**
 * Represents a base class for book records.
 * Provides properties for book records.
 */
class BookRecord {
    /**
     * Creates a new instance of the BookRecord class.
     * @param {Book} book - The book in the record.
     * @param {number} amount - The number of book copies.
     */
    constructor(book, amount = 1) {
        this.book = book;
        this.amount = amount;
    }
}

/**
 * Represents a base class for user's cart.
 * Provides properties and methods for carts.
 */
class Cart {
    // A private field with object of book records.
    // Keys are books' ISBN
    // Values are BookRecord objects
    #bookRecords;

    /**
     * Creates a new instance of the Cart class.
     * @param {User} user - The user which is cart's owner.
     */
    constructor(user) {
        this.user = user;
        this.#bookRecords = {};
    }

    /**
     * Adds book to the cart.
     * @param {Book} addedBook - The book to add to cart.
     */
    addBook(addedBook) {
        if (!addedBook.availability) {
            console.log(addedBook.toString() + ' is not available');
            return;
        }
        if (addedBook.isbn in this.#bookRecords) {
            this.#bookRecords[addedBook.isbn].amount++;
        }
        else {
            this.#bookRecords[addedBook.isbn] = new BookRecord(addedBook);
        }
    }

    /**
     * Adds several books to the cart.
     * @param {Book[]} addedBooks - The books to add to cart.
     */
    addBooks(...addedBooks) {
        addedBooks.forEach(addedBook => {
            if (!addedBook.availability) {
                console.log(addedBook.toString() + ' is not available');
                return;
            }
            this.addBook(addedBook);
        })
    }

    /**
     * Removes the book from the cart.
     * @param {string} bookisbn - The ISBN of the book to remove.
     */
    removeBook(bookisbn) {
        if (bookisbn in this.#bookRecords) {
            this.#bookRecords[bookisbn].amount--;
            console.log(`Book ${this.#bookRecords[bookisbn].book.title} amount in cart is reduced`);
        } else {
            console.log('There is no such book in your cart');
            return;
        }
        if (this.#bookRecords[bookisbn].amount <= 0) {
            delete this.#bookRecords[bookisbn];
            console.log('Book is no longer in cart')
        }
    }

    /**
     * Get total price of the cart's books.
     * @returns {number} The total price.
     */
    get totalPrice() {
        let total = Object.values(this.#bookRecords).reduce((acc, record) => {
            let discount = 1 - (this.user.discount + record.book.discount);
            discount += this.user.constructor.name == "StudentUser"
                && record.book.constructor.name == "TextBook" ? 0.05 : 0;
            discount += this.user.grade != undefined
                && this.user.grade == record.book.grade ? 0.05 : 0;
            return acc + record.book.price * record.amount * discount;
        }, 0);
        return Math.round(total * 100) / 100;
    }

    /**
     * Get the cart's books.
     * @returns {Book[]} The array of books.
     */
    get books() {
        return Object.values(this.#bookRecords).map(record => record.book);
    }

    /**
     * Get the cart's book records.
     * @returns {BookRecord[]} The array of book records.
     */
    get bookRecords() {
        return Object.values(this.#bookRecords);
    }

    //Logs the order details to the console
    showCart() {
        console.log(this.user.name + "'s Cart:");
        Object.values(this.#bookRecords).forEach(record => {
            console.log(record.book.toString() + "x" + record.amount);
        })
        console.log("Total Price:", this.totalPrice);
        console.log()
    }
}


/**
 * Calculates total price of books.
 * @param {User} user - user checking books.
 * @param {BookRecord[]} bookRecords - book records to calculate price.
 * @returns {number} - total price of books.
 */
function getBooksPrice(user, ...bookRecords) {
    const tempCart = new Cart(user);
    bookRecords.forEach(record => {
        for (let i = 0; i < record.amount; i++) {
            tempCart.addBook(record.book);
        }
    });
    return tempCart.totalPrice;
}

/**
 * Represents a base class for user's order.
 * Provides properties for order.
 */
class Order {
    /**
     * Creates a new instance of the Cart class.
     * @param {User} user - The user which makes order.
     * @param {BookRecord[]} books - The book records in the order.
     */
    constructor(user, books) {
        this.user = user;
        this.books = books;
        this.totalPrice = getBooksPrice(user, ...books);
    }

    //Logs the order details to the console
    showOrder() {
        console.log(`${this.user.name}'s Order:`);
        let userType = this.user.constructor.name == "StudentUser" ? "Student" : "User";
        console.log(userType + ": ", this.user.name);
        console.log("Books:");
        this.books.forEach(record => {
            console.log(record.book.toString() + "x" + record.amount);
        })
        console.log("Total Price:", this.totalPrice);
        console.log();
    }
}


const users = [
    new User("Alice Smith", "alice@example.com", "U001"),
    new User("Bob Johnson", "bob@example.com", "U002", 0.05),
    new StudentUser("Charlie Brown", "charlie@example.com", "U003", 0.08),
];

const bookStore = [
    new Book("Science Encyclopedia", "John Smith", "1234567890", 10.99, true),
    new FictionBook("1984", "George Orwell", "1234567891", "Dystopia", 8.99, true, 0.05),
    new Book("Bible", "Catholic Church", "1234567892", 12.99, true, 0.07),
    new FictionBook("Moby-Dick", "Herman Melville", "1234567893", "Novel", 15.99),
    new FictionBook("Pride and Prejudice", "Jane Austen", "1234567894", "Novel", 9.99, true),
    new TextBook("Math", "Mark Black", "1234567895", 8, 14.99, true)
];

function testRun() {
    // First user 
    const aliceCart = new Cart(users[0]);
    aliceCart.addBooks(bookStore[0], bookStore[1], bookStore[1], bookStore[2],);

    // Book removal
    aliceCart.showCart();
    aliceCart.removeBook("1234567891");
    console.log();
    aliceCart.showCart();


    // First user order
    const aliceOrder = new Order(users[0], aliceCart.bookRecords);
    aliceOrder.showOrder();

    // Second user
    const bobCart = new Cart(users[1]);
    bobCart.addBook(bookStore[3]);
    bobCart.showCart();

    // Second user order
    const bobOrder = new Order(users[1], bobCart.bookRecords);
    bobOrder.showOrder();

    // Third user
    const charlieCart = new Cart(users[2]);
    charlieCart.addBook(bookStore[4], bookStore[5], bookStore[5],);
    charlieCart.showCart();

    // Third user order
    const charlieOrder = new Order(users[2], charlieCart.bookRecords);
    charlieOrder.showOrder();
}

testRun();

