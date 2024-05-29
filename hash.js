/**
 * Class which represents a node inside hashtable.
 */
class HashNode {
    /**
     * Key of the current node
     * @type {any}
     */
    key;

    /**
     * Value of the current node.
     * @type {any} 
     */
    value;

    /** 
     * Link to the next node.
     * @type {HashNode | null}
     */
    #next;

    /**
     * Creates a new instance of the HashNode class.
     * @param {any} key - key of the node.
     * @param {any} value - value of the node.
     */
    constructor(key, value) {
        this.key = key;
        this.value = value;
        this.#next = null;
    }

    /**
     * @returns {HashNode|null} link to next node.
     */
    get next() {
        return this.#next;
    }

    /**
     * @param {HashNode|null} val - changes link to next node.
     */
    set next(val) {
        this.#next = val;
    }


    /**
     * Returns amount of nodes in list starting from current node.
     */
    get count() {
        let count = 1;
        let cur = this;
        while (cur.next != null) {
            cur = cur.next;
            count++;
        }
        return count;
    }
}

/**
 * Class which represents a hash table data structure.
 */
class HashTable {
    /**
     * An array with hashtable values.
     * @type {(HashNode|null)[]}
     */
    #table;

    /**
     * HashTable loadness (number of entries).
     * @type {number}
     */
    #loadness;

    /**
     * Creates a new instance of HashTable with passed size
     * @param {number} initialSize - a size of the hash table. If isn't prime increases to nearest prime
     */
    constructor(initialSize) {
        this.#table = Array(initialSize).fill(null);
        this.#loadness = 0;
    }

    /**
     * @returns {number} HashTable size
     */
    get size() {
        return this.#table.length;
    }

    /**
     * @returns {number} HashTable loadness
     */
    get loadness() {
        return this.#loadness;
    }

    /**
     * A custom hash function.
     * Gets integer from string by summing ASCII multiplied by index.
     * Uses multiplication method for getting hash code.
     * @param {string} key - key for hashing
     * @returns {number} hashed key
     */
    hash(key) {
        const A = (Math.sqrt(5) - 1) / 2;
        const m = this.size;
        let codeSum = 0;
        [...key].forEach((char, index) => codeSum += char.charCodeAt(0) * (index + 1));
        return Math.trunc(m * (codeSum * A - Math.trunc(codeSum * A)));
    }


    /**
     * Inserts a key-value pair to HashTable.
     * Increases loadness.
     * @param {any} key - key for hashing
     * @param {any} value - value to be stored
     */
    insert(key, value) {
        const node = new HashNode(key, value);
        let code = this.hash(key);
        console.log(`Key ${key} inserted at ${code}`)
        if (this.#table[code] == null) {
            this.#table[code] = node;
            console.log('to the empty cell');
        }
        else {
            node.next = this.#table[code];
            this.#table[code] = node;
            console.log('to the head of existing list');
        }
        this.#loadness++;
    }

    /**
     * Removes a key-value pair from HashTable.
     * Reduces loadness.
     * @param {any} key - key for deleting
     * @returns {HashNode} deleted node
     */
    delete(key) {
        let code = this.hash(key);

        //Stop if there is no node at index
        if (this.#table[code] == null) {
            return;
        }

        //Delete if it's in the list's head
        if (this.#table[code].key == key) {
            let deleted = this.#table[code];
            this.#table[code] = this.#table[code].next;
            this.#loadness--;
            return deleted;
        }

        //Find node
        let prev = this.#table[code];
        let cur = this.#table[code].next;
        while (cur != null && cur.key != key) {
            prev = prev.next;
            cur = cur.next;
        }

        //Stop if node wasn't found
        if (cur == null) {
            return;
        }

        //Delete if found
        prev.next = cur.next;
        this.#loadness--;
        return cur;
    }

    /**
     * Searches for value in HashTable and returns it
     * @param {any} key - key for search in table 
     * @returns {HashNode} found node
     */
    get(key) {
        let code = this.hash(key);

        //Stop if there is no node at index
        if (this.#table[code] == null) {
            return;
        }

        //Return if node is the list's head
        if (this.#table[code].key == key) {
            return this.#table[code];
        }

        //Find node
        let prev = this.#table[code];
        let cur = this.#table[code].next;
        while (cur != null && cur.key != key) {
            prev = prev.next;
            cur = cur.next;
        }
        if (cur != null) {
            return cur;
        }
    }

    /**
     * @returns {string} stringified hash table
     */
    toString() {
        let res = 'Hash table:\n';
        this.#table.forEach((val, index) => {
            if (val == null) {
                return;
            }
            else {
                res += index + ': ';
                let node = val;
                while (node != null) {
                    res += `${node.key} - ${node.value}; `;
                    node = node.next;
                }
                res += '\n';
            }
        });
        return res;
    }
}
/**
 * Class representing info about hero.
 * Used as value in hash table.
 */
class HeroInfo {
    /**
     * 
     * @param {string} heroName - name of the hero
     * @param {string} number - secret code number of hero
     */
    constructor(heroName, number) {
        this.heroName = heroName;
        this.number = number;
    }

    toString() {
        return `HeroInfo[Name: ${this.heroName}; number: ${this.number}]`;
    }
}

// Create empty hash table
const table = new HashTable(13);
console.log(table.toString());
console.log();

// Insert initial values inside table
table.insert('Batman', new HeroInfo('Bruce Wayne', '0423451235532'));
table.insert('Venom', new HeroInfo('Flash Thompson', '534523452344'));
table.insert('Superman', new HeroInfo('Clark Kent', '98624358328495'));
table.insert('Batgirl', new HeroInfo('Barbara Gordon', '21345892323'));
table.insert('Spiderman', new HeroInfo('Peter Parker', '783425982984'));
table.insert('Iron man', new HeroInfo('Tony Stark', '5342532452'));
table.insert('Deadpool', new HeroInfo('Wade Wilson', '7561234904'));
table.insert('Captain America', new HeroInfo('Steve Rogers', '32413243242'));
table.insert('Hulk', new HeroInfo('Bruce Banner', '90534523781'));
table.insert('Thor', new HeroInfo('Thor Odinson', '9999999999999'));
table.insert('Black Widow', new HeroInfo('Natasha Romanoff', '8888888888888'));
table.insert('Hawkeye', new HeroInfo('Clint Barton', '7777777777777'));
table.insert('Doctor Strange', new HeroInfo('Stephen Strange', '6666666666666'));
table.insert('Black Panther', new HeroInfo('T\'Challa', '5555555555555'));
table.insert('Ant-Man', new HeroInfo('Scott Lang', '4444444444444'));
table.insert('Wasp', new HeroInfo('Hope Van Dyne', '3333333333333'));
table.insert('Scarlet Witch', new HeroInfo('Wanda Maximoff', '2222222222222'));
table.insert('Vision', new HeroInfo('Vision', '1111111111111'));
table.insert('Falcon', new HeroInfo('Sam Wilson', '1010101010101'));
table.insert('Winter Soldier', new HeroInfo('Bucky Barnes', '2020202020202'));
table.insert('Star-Lord', new HeroInfo('Peter Quill', '3030303030303'));
table.insert('Gamora', new HeroInfo('Gamora', '4040404040404'));
table.insert('Drax', new HeroInfo('Drax the Destroyer', '5050505050505'));
table.insert('Rocket', new HeroInfo('Rocket Raccoon', '6060606060606'));
table.insert('Groot', new HeroInfo('Groot', '7070707070707'));
table.insert('Mantis', new HeroInfo('Mantis', '8080808080808'));
table.insert('Nebula', new HeroInfo('Nebula', '9090909090909'));
table.insert('War Machine', new HeroInfo('James Rhodes', '11223344556677'));
table.insert('Captain Marvel', new HeroInfo('Carol Danvers', '33445566778899'));
table.insert('Loki', new HeroInfo('Loki Laufeyson', '44556677889900'));

console.log();
console.log(table.loadness);
console.log(table.toString());

// Find values inside hash table
console.log();
console.log(table.get('Spiderman'));
console.log(table.get('Batman'));
console.log(table.get('Deadpool'));
console.log(table.get('Thor'));
console.log(table.get('Black Panther'));

// Delete value which is child node
console.log();
console.log('Delete Batgirl');
table.delete('Batgirl');
console.log(table.loadness);
console.log(table.toString());

// Delete value which is head node
console.log();
console.log('Delete Hulk');
table.delete('Hulk');
console.log(table.loadness);
console.log(table.toString());

// Delete value which is only node at index
console.log();
console.log('Delete Falcon');
table.delete('Falcon');
console.log(table.loadness);
console.log(table.toString());

// Delete more values to test
console.log();
console.log('Delete Thor, Black Widow, Hawkeye, Doctor Strange');
table.delete('Thor');
table.delete('Black Widow');
table.delete('Hawkeye');
table.delete('Doctor Strange');
console.log(table.loadness);
console.log(table.toString());


/**
 * ANALYSIS
 * 
 * Hash function:
 * For hashing were combined 2 operations.
 * 
 * 1) Getting number from string
 * At first we need to get some number value from string key.
 * But also we should remember that we need to distribute values uniformly
 * and we don't want to get the same hashed value for string with the same 
 * char combination.
 * So we calculate number represantation as some of characters' ASCII 
 * multiplied by index+1(to include character at index 0) 
 * 
 * 2) Getting hashed value
 * For that was used the mulptiplication method 
 * Math.trunc(m * (code * A - Math.trunc(codeSum * A)))
 * Value m defines max value which can be gotten with hashing.
 * Value A influences on distribution of hashed values.
 * In this case was used a value of 1/golden_ratio, because
 * it's recommended to use it as giving the most uniformly distributed 
 * values.
 * 
 * This method gives uniform distribution, however it's significantly
 * harder to calculate because of number of math operations.
 * 
 * 
 * Hash table:
 * For collision handling was used the chaining method.
 * For that was made a custom HashNode class which stores key-value 
 * pair and link to the next node. 
 * Separate class for linked list wasn't implemented, because all the 
 * operations are made through the nodes itself or through HashTable methods.
 * 
 * Cons:
 * This method uses more space than other methods because of usage of seperate 
 * data structure.
 * If chains are too long search will be slower, especially for 'old' elements.
 * Some parts of hash table may not be used.
 * 
 * Pros:
 * We can store more values than table's size. 
 * Keys aren't moved in table.
 * Fast insert of new values.
 * It's easy and fast to access or delete recently inserted elements.
 * We don't need to deal with clusters which are caused with open addressing.
 * We don't have to store spare cells in table
 */
