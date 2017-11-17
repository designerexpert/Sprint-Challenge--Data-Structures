/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
// const { LimitedArray, getIndexBelowMax } = require('./hash-table-helpers');
class LimitedArray {
  constructor(limit) {
    // You should not be directly accessing this array from your hash table methods
    // Use the getter and setter methods included in this class to manipulate data in this class
    this.storage = [];
    this.limit = limit;
  }

  checkLimit(index) {
    if (typeof index !== 'number') throw new Error('The supplied index needs to be a number');
    if (this.limit <= index) {
      throw new Error('The supplied index lies out of the array\'s bounds');
    }
  }

  each(cb) {
    for (let i = 0; i < this.storage.length; i++) {
      cb(this.storage[i], i);
    }
  }
  // Use this getter function to fetch elements from this class
  get(index) {
    this.checkLimit(index);
    return this.storage[index];
  }

  get length() {
    return this.storage.length;
  }
  // Use this setter function to add elements to this class
  set(index, value) {
    this.checkLimit(index);
    this.storage[index] = value;
  }
}
class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
  }
  push(key, value) {
    const newNode = {
      value,
      key,
      next: null,
    };
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      this.tail = newNode;
    }
  }
  shift() {
    if (!this.head) return null;
    if (!this.head.next) this.tail = null;

    const node = this.head.value;
    this.head = this.head.next;
    return node;
  }
  contains(value) {
    let currentNode = this.head;
    while (currentNode !== null) {
      if (currentNode.value === value) {
        return true;
      }

      currentNode = currentNode.next;
    }
    return false;
  }
  filter(cb) {
    // Loop Through Our Linked List
    // On each item check if(cb)
    // + add each item to an array
    // return said array
    let currentNode = this.head;
    let returnBucket = new LinkedList();
    while (currentNode !== null) {
      if (cb(currentNode)) {
        console.log(currentNode.key)
        returnBucket.push(currentNode);
      }
      currentNode = currentNode.next;
    }
    return returnBucket;
  }

};
/* eslint-disable no-bitwise, operator-assignment */
// This is hash function you'll be using to hash keys
// There's some bit-shifting magic going on here, but essentially, all it is doing is performing the modulo operator
// on the given `str` arg (the key) modded by the limit of the limited array
// This simply ensures that the hash function always returns an index that is within the boundaries of the limited array
const getIndexBelowMax = (str, max) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) + hash + str.charCodeAt(i);
    hash = hash & hash;
    hash = Math.abs(hash);
  }
  return hash % max;
};

class HashTable {
  constructor(limit = 8) {
    this.limit = limit;
    this.storage = new LimitedArray(this.limit);
    // Do not modify anything inside of the constructor
  }

  resize() {
    this.limit *= 2;
    const oldStorage = this.storage;
    this.storage = new LimitedArray(this.limit);
    oldStorage.each((bucket) => {
      if (!bucket) return;
      // Create forEach inside Linked List Expects Callback Function, returns
      bucket.forEach((pair) => {
        this.insert(pair[0], pair[1]);
      });
    });
  }

  capacityIsFull() {
    let fullCells = 0;
    this.storage.each((bucket) => {
      if (bucket !== undefined) fullCells++;
    });
    return fullCells / this.limit >= 0.75;
  }

  // Adds the given key, value pair to the hash table
  // Fetch the bucket associated with the given key using the getIndexBelowMax function
  // If no bucket has been created for that index, instantiate a new bucket and add the key, value pair to that new bucket
  // If the key already exists in the bucket, the newer value should overwrite the older value associated with that key
  insert(key, value) {
    if (this.capacityIsFull()) this.resize();
    const index = getIndexBelowMax(key.toString(), this.limit);

    const linkedList = new LinkedList(); // MINE!
    let bucket = this.storage.get(index) || linkedList; // Bucket = Whatever is inside Hash Index or a new LinkedList
    // bucket = bucket.filter(item => item[0] !== key); // Checking if each item's key !== key
    bucket = bucket.filter((item) => {
      item.key !== key
    });
    bucket.push(key, value);
    this.storage.set(index, bucket);
    return linkedList;
  }
  // Removes the key, value pair from the hash table
  // Fetch the bucket associated with the given key using the getIndexBelowMax function
  // Remove the key, value pair from the bucket
  remove(key) {
    const index = getIndexBelowMax(key.toString(), this.limit);
    let bucket = this.storage.get(index);

    if (bucket) {
      bucket = bucket.filter(item => item.key !== key);
      this.storage.set(index, bucket);
    }
  }
  // Fetches the value associated with the given key from the hash table
  // Fetch the bucket associated with the given key using the getIndexBelowMax function
  // Find the key, value pair inside the bucket and return the value
  retrieve(key) {
    const index = getIndexBelowMax(key.toString(), this.limit);
    const bucket = this.storage.get(index);

    let retrieved;
    if (bucket) {
      //retrieved = bucket.filter(item => item[0] === key)[0];
      retrieved = bucket.filter(item => item.key === key);
    }

    return retrieved.head.key.key ? retrieved.head.key : undefined;
  }
}

module.exports = HashTable;

let h = new HashTable();

h.insert('name', 'Elementary');
h.insert('name', 'Moises');
h.insert('age', 33);
console.log(h.storage)
// h.remove()
console.log(h.retrieve('age'));
console.log(h.remove('age'));
console.log(h.storage)
console.log(h.retrieve('age'));
