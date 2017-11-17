##Question: What are the order of insertions/removals for the following data structures? 
1. Stack: The last item added is the first item removed, like stacking books ontop of a pile.
2. Queue: The first item added is the first item removed, like a line at the coffee shop. First to come is first to be served.
##Question: What is the retreival time complexity for the following data structures? 
1. Linked List: O(n) linear, the larger the size, the longer it takes to retrieve
2. Hash Table: O(1) constant, takes the same time to retrieve items no matter the size
3. Binary Search Tree: O(log(n)) better than linear, and really fast in the first 3 steps, but the more steps it takes to look the closer it gets to linear or O(n).
##Question: What are some advantages to using a Hash Tables over an array in JavaScript?
1. Hash tables have a constant retrieval speed, alowing to instantly find an item without having to loop over the whole data structure to do so.