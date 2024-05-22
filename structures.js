/**
 * Represents a class for Stack data structure.
 * Provides properties for storing elements 
 * and methods for data manipulations.
 */
class Stack {

    /** A private property for storing stack elements*/
    #items;

    /** Creates a new instance of the Stack.*/
    constructor() {
        this.#items = [];
    }

    /**
     * Pushes value to the top of the stack.
     * @param {any} val - a value to push to the stack.
     */
    push(val) {
        this.#items.push(val);
    }

    /**
     * Removes and returns top value from the stack.
     * @returns {any} top value removed from the stack.
     */
    pop() {
        return this.#items.pop();
    }

    /**
     * Returns top value from the stack without removing.
     * @returns {any} top value from the stack.
     */
    peek() {
        return this.#items[this.#items.length - 1];
    }

    /**
     * Returns true if stack is empty.
     * @returns {boolean} is stack empty.
     */
    isEmpty() {
        return this.#items.length === 0;
    }
}

let str = 'Hello, world';
console.log('String to reverse: "' + str + '"');
const stack = new Stack();
for (let char of str) {
    stack.push(char);
}
let reversedStr = "";
while (!stack.isEmpty()) {
    reversedStr += stack.pop();
}
console.log('Reversed string: "' + reversedStr + '"');

/** 
 * Represents a class for a min/max stack 
 * Supports finding the minimum and maximum elements
 * in constant time (O(1))*/
class MinMaxStack extends Stack {
    /** A private property for storing stack elements*/
    #items;
    /** A private property for storing stack elements from
     *  maximum to minimum for finding maximum and minimum */
    #minItems;

    /**
     * Creates a new instance of the min/max Stack.
     */
    constructor() {
        super();
        this.#items = [];
        this.#minItems = [];
    }

    /**
     * Pushes value to the top of the stack.
     * @param {any} val - value to push to the stack.
     */
    push(val) {
        //Push to main array
        this.#items.push(val);

        //Push to array of minimum values
        let minPosition = this.#minItems.findIndex(element => element < val);
        if (minPosition === -1) {
            this.#minItems.push(val);
        } else {
            this.#minItems.splice(minPosition, 0, val);
        }
    }

    /**
     * Removes and returns top value from the stack.
     * @returns {any} top value removed from the stack.
     */
    pop() {
        let val = this.#items[this.#items.length - 1];
        //Remove from minimum and maximum values storage
        this.#minItems.splice(this.#minItems.indexOf(val), 1);
        return this.#items.pop();
    }

    /**
     * Returns minimum value from the stack in constant time
     * @returns {any} minimum value from the stack.
     */
    getMin() {
        return this.#minItems[this.#minItems.length - 1];
    }

    /**
     * Returns maximum value from the stack in constant time
     * @returns {any} maximum value from the stack.
     */
    getMax() {
        return this.#minItems[0];
    }
}

// Create an instance of MinMaxStack
let heightStack = new MinMaxStack();

// Push people's heights onto the stack
heightStack.push(170); // Height in cm
heightStack.push(160);
heightStack.push(180);
heightStack.push(155);
heightStack.push(165);

// Retrieve the minimum and maximum heights
console.log("Minimum height:", heightStack.getMin()); // Output: Minimum height: 155
console.log("Maximum height:", heightStack.getMax()); // Output: Maximum height: 180

// Pop a height and check min and max again
heightStack.pop(); // Pops 165
console.log("Minimum height after pop:", heightStack.getMin()); // Output: Minimum height after pop: 155
console.log("Maximum height after pop:", heightStack.getMax()); // Output: Maximum height after pop: 180

heightStack.pop(); // Pops 155
console.log("Minimum height after another pop:", heightStack.getMin()); // Output: Minimum height after another pop: 160
console.log("Maximum height after another pop:", heightStack.getMax()); // Output: Maximum height after another pop: 180

// Queue: Implement a class for a queue data structure.
// Include methods for enqueue, dequeue, and peek
class Queue {

    /** A private property for storing queue elements*/
    #items;

    /** Creates a new instance of the Queue.*/
    constructor() {
        this.#items = [];
    }

    /**
     * Adds a value to the end of the queue.
     * @param {any} val - a value to add to the queue.
     */
    enqueue(val) {
        this.#items.push(val);
    }

    /**
     * Removes and returns first value from the queue.
     * @returns {any} first value removed from the queue.
     */
    dequeue() {
        return this.#items.shift();
    }

    /**
     * Returns first value from the queue without removing.
     * @returns {any} first value from the queue.
     */
    peek() {
        return this.#items[0];
    }

    /**
     * Returns true if queue is empty.
     * @returns {boolean} is stack empty.
     */
    isEmpty() {
        return this.#items.length < 1;
    }
}

// Creating a new queue for serving clients
const clientQueue = new Queue();

// Adding clients to the queue
clientQueue.enqueue("Client 1");
clientQueue.enqueue("Client 2");
clientQueue.enqueue("Client 3");

// Serving clients in the order they arrived
while (!clientQueue.isEmpty()) {
    const nextClient = clientQueue.dequeue();
    console.log("Serving", nextClient);
}

/**
 * Represents a class for a binary tree node
 */
class BinaryNode {
    /**
     * Value of the current node.
     * @type {any} */
    nodeVal;

    /**
     * Link to the left child node.
     * @type {BinaryNode | null}
     */
    leftChild;

    /**
     * Link to the right child node.
     * @type {BinaryNode | null}
     */
    rightChild;

    /**
     * Creates a new instance of the BinaryNode class.
     * @param {any} val - value of the node.
     */
    constructor(val) {
        this.nodeVal = val;
        this.leftChild = null;
        this.rightChild = null;
    }

    /**
     * Returns true if this node is internal in binary tree
     * @returns {boolean} is node internal.
     */
    isInternal() {
        return this.leftChild != null
            || this.rightChild != null
    }
}

/**
 * Represents a class for a binary tree
 */
class BinaryTree {
    /**
     * link to the root.
     * @type {BinaryNode}
     */
    #root;

    /**
     * Creates a new instance of the BinaryTree class.
     */
    constructor() {
        this.#root = null;
    }

    /**
     * Inserts a value to a binary tree 
     * @param {number} val - value to insert
     */
    insert(val) {
        if (this.#root == null) {
            this.#root = new BinaryNode(val);
            return;
        }
        this.insertNodeBst(this.#root, val);
    }

    /**
     * Insert a val to a child of the node recursively
     * Uses Binary Search Tree principle
     * @param {BinaryNode} node - parent node 
     * @param {number} val - value to insert
     */
    insertNodeBst(node, val) {
        if (val < node.nodeVal) {
            if (node.leftChild == null) {
                node.leftChild = new BinaryNode(val);
                return;
            }
            this.insertNodeBst(node.leftChild, val);
        }
        else {
            if (node.rightChild == null) {
                node.rightChild = new BinaryNode(val);
                return;
            }
            this.insertNodeBst(node.rightChild, val)
        }
    }

    /**
     * @returns {BinaryNode} binary tree root
     */
    get root() {
        return this.#root;
    }

    /**
    * Inserts a value to a binary tree in ramdom place
    * @param {number} val - value to insert
    */
    insertRnd(val) {
        if (this.#root == null) {
            this.#root = new BinaryNode(val);
            return;
        }
        this.insertNodeRnd(this.#root, val);
    }

    /**
     * Insert a val to a child of the node recursively
     * Inserts to random new child node
     * @param {BinaryNode} node - parent node 
     * @param {number} val - value to insert
     */
    insertNodeRnd(node, val) {
        if (node.leftChild == null) {
            node.leftChild = new BinaryNode(val);
            return;
        }
        else if (node.rightChild == null) {
            node.rightChild = new BinaryNode(val);
            return;
        }

        let next = Math.random() <= 0.5 ?
            node.leftChild : node.rightChild;

        this.insertNodeRnd(next, val);
    }

    /**
     * Traverse binary tree in-order
     * @returns {string} traversing string
     */
    traverseInOrder() {
        let res = '';
        const inOrder = node => {
            if (node != null) {
                console.log(node.nodeVal);
                if (node.isInternal()) {
                    inOrder(node.leftChild)
                }
                res += node.nodeVal + '; ';
                if (node.isInternal()) {
                    inOrder(node.rightChild)
                }
            }
        }
        inOrder(this.#root);
        return res;
    }

    search(val, node = this.#root) {
        if (this.#root == null) {
            return null;
        }
        else {
            if (node.nodeVal == val) {
                return node;
            }
            else if (val < node.nodeVal) {
                return this.search(val, node.leftChild);
            }
            else {
                return this.search(val, node.rightChild);
            }
        }

    }
}

/**
 * Returns true if Binary Tree is Binary Search Tree
 * @param {BinaryNode} node - current central node 
 * @returns {boolean} is tree a BST
 */
function isBST(node) {
    let res = true;
    if (node.leftChild != null) {
        res &&= node.nodeVal > node.leftChild.nodeVal;
        res &&= isBST(node.leftChild);
    }
    if (node.rightChild != null) {
        res &&= node.nodeVal < node.rightChild.nodeVal;
        res &&= isBST(node.rightChild);
    }
    return res;
}

// Create a new instance of BinaryTree
const binarySearchTree = new BinaryTree();

// Insert some values into the binary search tree
binarySearchTree.insert(10);
binarySearchTree.insert(5);
binarySearchTree.insert(15);
binarySearchTree.insert(3);
binarySearchTree.insert(7);
binarySearchTree.insert(12);
binarySearchTree.insert(20);

//Search for node
console.log(binarySearchTree.search(15));

//Traverse binary tree
console.log(binarySearchTree.traverseInOrder());

// Check if the binary tree is a binary search tree
const BSTisBST = isBST(binarySearchTree.root);
console.log("Is the binary tree a binary search tree?", BSTisBST);


// Insert some values into the binary tree randomly
binarySearchTree.insertRnd(16);

console.log(binarySearchTree.traverseInOrder());

// Check if the binary tree is a binary search tree
const RNDisBST = isBST(binarySearchTree.root);
console.log("Is the binary tree a binary search tree no?", RNDisBST);


/**
 * Represenst a graph vertex class
 */
class Vertex {
    /**
     * Creates a new instance of Vertex
     */
    constructor(val) {
        this.value = val;
    }
}

/**
 * Represents a class for graph data structure.
 * Provides properties and methods for working
 * with its vertices and edges
 */
class Graph {
    /** 
     * Array of graph vertices
     * @type {Vertex[]}*/
    #vertices;

    /** 
     * Matrix representing graph edges
     * and their weights
     * @type {number[][]}*/
    #edgesMatrix;

    /**
     * Creates a new instance of Graph
     */
    constructor() {
        this.#vertices = [];
        this.#edgesMatrix = [];
    }

    /**
     * @returns {Object[]} array of objects with vertices values and indexes
     */
    get vertices() {
        return this.#vertices.map((val, index) => { return { value: val.value, index: index } });
    }

    /**
     * Gets weight of edge between vertices.
     * @param {Vertex} v1 - vertex 1
     * @param {Vertex} v2 - vertex 2
     * @returns {number} weight of edge.
     */
    getWeight(v1, v2) {
        return this.#edgesMatrix[v1][v2];
    }

    /**
     * Adds a vertex with passed value.
     * @param {any} val - value to add
     */
    addVertex(val) {
        this.#vertices.push(new Vertex(val));
        const len = this.#vertices.length;
        this.#edgesMatrix.push(Array(len).fill(0));
        for (let i = 0; i < len - 1; i++) {
            this.#edgesMatrix[i].push(0);
        }
    }

    /**
     * Adds an edge between two vertices.
     * @param {number} index1 - vertice 1 index
     * @param {number} index2 - vertice 2 index
     * @param {number} weight - weight of the edge
     */
    addEdge(index1, index2, weight = 1) {
        if (this.#edgesMatrix.length <= 0) return;
        this.#edgesMatrix[index1][index2] = weight;
        this.#edgesMatrix[index2][index1] = weight;
    }

    /**
     * Returns an array of indexes of vertices connected to the vertex.
     * @param {number} index - index of vertex.
     * @returns {number[]} indexes of vertices.
     */
    getAdjacent(index) {
        let adjacent = [];
        for (let i = 0; i < this.#vertices.length; i++) {
            if (this.#edgesMatrix[index][i] > 0) {
                adjacent.push(i);
            }
        }
        return adjacent;
    }


    /**
     * Returns string representing a graph with DFS
     * @param {number} startIndex - index to start search.
     * @returns {string} - representation of graph.
     */
    depthFirstSearch(startIndex) {
        let path = '';
        let visited = Array(this.#vertices.length).fill(false);
        let stack = new Stack();
        stack.push(startIndex);
        let curIndex;
        while (!stack.isEmpty()) {
            curIndex = stack.pop();
            if (!visited[curIndex]) {
                path += this.#vertices[curIndex].value + '; ';
                visited[curIndex] = true;
                let adjacent = this.getAdjacent(curIndex);
                for (let i = 0; i < adjacent.length; i++) {
                    stack.push(adjacent[i]);
                }
            }
        }
        return path;
    }


    /**
     * Returns string representing a graph with BFS
     * @param {number} startIndex - index to start search.
     * @returns {string} - representation of graph.
     */
    breadthFirstSearch(startIndex) {
        let path = '';
        let visited = Array(this.#vertices.length).fill(false);
        let queue = new Queue();
        queue.enqueue(startIndex);
        visited[startIndex] = true;

        let curIndex;
        while (!queue.isEmpty()) {
            curIndex = queue.dequeue();
            path += this.#vertices[curIndex].value + '; ';
            let adjacent = this.getAdjacent(curIndex);
            for (let i = 0; i < adjacent.length; i++) {
                if (!visited[adjacent[i]]) {
                    visited[adjacent[i]] = true;
                    queue.enqueue(adjacent[i]);
                }
            }
        }
        return path;
    }

    /**
     * Uses Dijkstra's algorithm to get shortest path
     * in weighted graph 
     * @param {number} v1 - start vertex index
     * @param {number} v2 - end vertex index
     * @returns {any[]} array of path from v1 to v2
     */
    dijkstraPath(v1, v2) {
        const len = this.#vertices.length;
        const estimated = Array(len).fill(Number.POSITIVE_INFINITY);
        const prev = Array(len).fill(-1);
        const visited = Array(len).fill(false);
        estimated[v1] = 0;
        let curV;
        while (!visited[v2]) {
            let minDistance = Number.POSITIVE_INFINITY;
            curV = -1;
            for (let i = 0; i < len; i++) {
                if (!visited[i] && estimated[i] < minDistance) {
                    minDistance = estimated[i];
                    curV = i;
                }
            }

            if (curV === -1) {
                break;
            }
            visited[curV] = true;
            let adjacent = this.getAdjacent(curV);
            for (let i = 0; i < adjacent.length; i++) {
                if (estimated[curV] + this.getWeight(curV, adjacent[i]) < estimated[adjacent[i]]) {
                    estimated[adjacent[i]] = estimated[curV] + this.getWeight(curV, adjacent[i]);
                    prev[adjacent[i]] = curV;
                }
            }
        }

        let path = [];
        for (let i = v2; i != -1; i = prev[i]) {
            path.push(i);
        }
        path.reverse();
        if (path[0] === v1) {
            return path.map(i => this.#vertices[i].value);
        }
        return [];
    }

    /**
     * Uses BFS algorithm to get shortest path
     * in unweighted graph 
     * @param {number} v1 - start vertex index
     * @param {number} v2 - end vertex index
     * @returns {any[]} array of path from v1 to v2
     */
    bfsPath(v1, v2) {
        const len = this.#vertices.length;
        const prev = Array(len).fill(-1);
        let visited = Array(len).fill(false);
        let queue = new Queue();
        queue.enqueue(v1);
        visited[v1] = true;

        let curIndex;
        while (!queue.isEmpty()) {
            curIndex = queue.dequeue();
            let adjacent = this.getAdjacent(curIndex);
            for (let i = 0; i < adjacent.length; i++) {
                if (!visited[adjacent[i]]) {
                    visited[adjacent[i]] = true;
                    queue.enqueue(adjacent[i]);
                    prev[adjacent[i]] = curIndex;
                }
            }
        }

        let path = [];
        for (let i = v2; i != -1; i = prev[i]) {
            path.push(i);
        }
        path.reverse();
        if (path[0] === v1) {
            return path.map(i => this.#vertices[i].value);
        }
        return [];
    }
}

// Create a graph instance
const graph = new Graph();

// Add vertices (cities)
const cities = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"];
cities.forEach(city => graph.addVertex(city));

// Add edges (connections between cities) with weights
graph.addEdge(0, 1, 2451); // New York <-> Los Angeles
graph.addEdge(0, 2, 713);  // New York <-> Chicago
graph.addEdge(1, 2, 1751); // Los Angeles <-> Chicago
graph.addEdge(1, 3, 1547); // Los Angeles <-> Houston
graph.addEdge(2, 3, 940);  // Chicago <-> Houston
graph.addEdge(2, 4, 1443); // Chicago <-> Phoenix
graph.addEdge(3, 4, 1015); // Houston <-> Phoenix

console.log(graph.breadthFirstSearch(0));
console.log(graph.depthFirstSearch(0));

// Find the shortest path between two cities using Dijkstra's algorithm
const shortestPath = graph.dijkstraPath(0, 4); // Shortest path from New York to Phoenix
console.log("Shortest path:", shortestPath.join(" -> "));


// Create a graph instance
const learningPath = new Graph();

// Add vertices (technologies)
const technologies = ["HTML", "CSS", "JavaScript", "React", "Node.js", "Express", "MongoDB"];
technologies.forEach(tech => learningPath.addVertex(tech));
// Add edges (connections between technologies)
learningPath.addEdge(0, 1); // HTML -> CSS
learningPath.addEdge(1, 2); // CSS -> JavaScript
learningPath.addEdge(2, 3); // JavaScript -> React
learningPath.addEdge(2, 4); // JavaScript -> Node.js
learningPath.addEdge(4, 5); // Node.js -> Express
learningPath.addEdge(4, 6); // Node.js -> MongoD

console.log(learningPath.breadthFirstSearch(0));
console.log(learningPath.depthFirstSearch(0));

// Find the shortest path between two technologies using BFS algorithm
const shortestPathLearn = learningPath.bfsPath(0, 6);
console.log(shortestPathLearn); // Shortest path from HTML to MongoDB
console.log("Shortest path:", shortestPathLearn.join(" -> "));


/**
 * Represents a class for node of linked list.
 */
class LinkedNode {
    /**
     * Value of the current node.
     * @type {any} */
    #nodeVal;

    /** 
     * Link to the next node.
     * @type {LinkedNode | null}
     */
    #next;

    /**
     * Creates a new instance of the LinkedNode class.
     * @param {any} val - value of the node.
     */
    constructor(val = null) {
        this.#nodeVal = val;
        this.#next = null;
    }

    /**
     * @returns {any} value of node.
     */
    get value() {
        return this.#nodeVal;
    }

    /**
     * @returns {LinkedNode} link to next node.
     */
    get next() {
        return this.#next;
    }

    /**
     * @param {LinkedNode} val - changes link to next node.
     */
    set next(val) {
        this.#next = val;
    }
}

/**
 * Represents a class for a singly linked list data structure.
 * Implements methods for inserting nodes, deleting nodes, 
 * and searching for a node.
 */
class LinkedList {

    /**
     * A link to the head of the list
     * @type {LinkedNode | null}
     */
    #head;

    /**
     * Creates an instance of LinkedList
     * @param {any} initial - head initial value 
     */
    constructor(initial = null) {
        this.#head = new LinkedNode(initial);
    }

    /**
     * Inserts a value to the list's start
     * @param {any} val - value to insert
     */
    insertStart(val) {
        const newHead = new LinkedNode(val);
        newHead.next = this.#head;
        this.#head = newHead;
    }

    /**
     * Inserts a value to the list's end
     * @param {any} val - value to insert
     */
    insertEnd(val) {
        const newEnd = new LinkedNode(val);
        let curNode = this.#head;
        while (curNode.next != null) {
            curNode = curNode.next;
        }
        curNode.next = newEnd;
    }

    /**
     * Inserts a value at some position
     * @param {any} val - value to insert
     * @param {number} position - position to insert
     */
    insertAt(val, position) {
        let prev = this.#head;
        let insertedNode = new LinkedNode(val);
        if (position === 1) {
            this.insertStart(val);
        }
        for (let i = 0; i < position; i++) {
            if (i === position - 2) {
                let next = prev.next;
                prev.next = insertedNode;
                insertedNode.next = next;
            }
            else {
                if (prev.next == null) {
                    break;
                }
                prev = prev.next;
            }
        }
    }

    /**
     * Deletes current head
     */
    deleteStart() {
        if (this.#head.next == null) {
            this.#head = null;
        }
        const newHead = this.#head.next;
        this.#head.next = null;
        this.#head = newHead;
    }

    /**
     * Deletes current tail
     */
    deleteEnd() {
        if (this.#head.next == null) {
            this.#head = null;
        }
        let curNode = this.#head;
        while (curNode.next.next != null) {
            curNode = curNode.next;
        }
        curNode.next = null;
    }

    /**
     * Deletes node at some position
     * @param {number} position 
     */
    delete(position) {
        let prev = this.#head;
        let temp = this.#head;
        if (position === 1) {
            this.deleteStart();
        }
        for (let i = 0; i < position; i++) {
            if (i === position - 1 && temp) {
                prev.next = temp.next;
                temp = null;
            } else {
                prev = temp;
                if (prev === null) break;
                temp = temp.next;
            }
        }
    }

    /**
     * Looks for node at position and returns its value
     * @param {number} position - position to search
     * @returns {any} value of the node
     */
    search(position) {
        if (position == 1) {
            return this.#head.value;
        }
        let curNode = this.#head;
        for (let i = 0; i < position; i++) {
            if (i === position - 1 && curNode) {
                return curNode.value;
            } else {
                if (curNode.next == null) break;
                curNode = curNode.next;
            }
        }
    }

    toString() {
        let res = '';
        const readNode = (node = this.#head) => {
            res += `${node.value}; `;
            if (node.next == null) {
                return;
            }
            readNode(node.next);
        }
        readNode();
        return res;
    }
}

/**
 * Returns true if the list contains cycled links
 * @param {LinkedNode} head - head node of the list
 * @returns {boolean} is there a cycle in list
 */
function detectCycle(head) {
    let slowPointer = head;
    let fastPointer = head;

    while (slowPointer != null
        && fastPointer != null
        && fastPointer.next != null) {
        slowPointer = slowPointer.next;
        fastPointer = fastPointer.next.next;
        if (slowPointer == fastPointer)
            return true;
    }
    return false;
}
// Create a new instance of LinkedList
const mathList = new LinkedList();

// Insert math topics into the list
mathList.insertEnd("Algebra");
mathList.insertEnd("Geometry");
mathList.insertEnd("Trigonometry");
mathList.insertEnd("Calculus");
mathList.insertEnd("Probability");
mathList.insertEnd("Statistics");

// Display the initial list
console.log("Initial list:");
console.log(mathList.toString());

// Insert "Linear Algebra" at the start
mathList.insertStart("Linear Algebra");

// Insert "Differential Equations" at position 4
mathList.insertAt("Differential Equations", 4);

// Display the modified list
console.log("\nList after inserts:");
console.log(mathList.toString());

// Delete the first node
mathList.deleteStart();

// Delete the node at position 3
mathList.delete(3);

// Delete the last node
mathList.deleteEnd();

// Display the final list
console.log("\nList after deletes:");
console.log(mathList.toString());

// Delete the first node
mathList.deleteStart();

// Delete the node at position 3
mathList.delete(3);

// Delete the last node
mathList.deleteEnd();

// Display the final list
console.log("\nList after deletes:");
console.log(mathList.toString());

// Create nodes
const node1 = new LinkedNode("Main Street");
const node2 = new LinkedNode("Oak Avenue");
const node3 = new LinkedNode("Elm Drive");
const node4 = new LinkedNode("Maple Road");

// Connect nodes
node1.next = node2;
node2.next = node3;
node3.next = node4;

// Uncomment the line below to create a cycle for testing
// node4.next = node1;


// Check for cycle
const hasCycle = detectCycle(node1); // node1 is the head of the list
if (hasCycle) {
    console.log("There is a cycle in the list.");
} else {
    console.log("There is no cycle in the list.");
}

