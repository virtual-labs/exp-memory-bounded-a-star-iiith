class PriorityQueue {
    constructor() {
      this.queue = [];
    }
  
    put(priority, element) {
      this.queue.push({ priority, element });
      this.queue.sort((a, b) => a.priority - b.priority);
    }
  
    get() {
      return this.queue.shift();
    }

    top() {
        if (this.queue.length === 0) {
            return null;
        }
        return this.queue[0];
    }
  
    empty() {
      return this.queue.length === 0;
    }

    clear() {
        this.queue = [];
    }

    sort() {
      this.queue.sort((a, b) => {
          if (a.priority === b.priority) {
              // If priorities are equal, sort based on level
              return a.level - b.level;
          } else {
              // Sort based on priority
              return a.priority - b.priority;
          }
      });
    }

    remove(value) {
      this.queue = this.queue.filter(item => item.element !== value);
    }

    toString() {
        return this.queue.map(item => '(' + item.element + ', ' + item.priority + ')').join(', ');
    }
}