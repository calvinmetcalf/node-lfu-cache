var Yallist = require('yallist')

class Item {
  constructor(value, freq, list) {
    this.value = value;
    this.list = list;
    this.freq = freq;
    this.next = this.prev = null;
    this.freq.pushItem(this);
  }
  bump() {
    // console.log('bump', this);
    var cur = this.freq;
    var inc = cur.getNext();
    cur.removeItem(this);
    if (!cur.head && !cur.tail) {
      this.list.removeFreq(cur);
    }
    inc.pushItem(this);
  }
}
class FreqItem {
  constructor(num) {
    this.num = num;
    this.head = this.tail = null;
    this.next = this.prev = null;
  }
  pushItem(node) {
    node.freq = this;
    if (!this.head && !this.tail) {
      this.head = this.tail = node;
      return;
    }
    node.prev = this.tail;
    node.next = null;
    this.tail.next = node;
    this.tail = node;
  }
  // unshiftItem(node) {
  //   if (!this.head && !this.tail) {
  //     this.head = this.tail = node;
  //     return;
  //   }
  //   node.next = this.head;
  //   this.head.prev = node;
  //   this.head = node;
  // }
  removeItem(node) {
    if (this.head === node) {
      if (this.tail === node) {
        this.head = this.tail = null;
        return;
      }
      this.head = node.next;
      this.head.prev = null;
      return;
    }
    if (this.tail === node) {
      this.tail = node.prev;
      this.tail.next = null;
      return;
    }
    let prev = node.prev;
    let next = node.next;
    prev.next = next;
    next.prev = prev;
  }
  insertBefore(node) {
    node.next = this;
    // if (this.prev) {
    //   this.prev.next = node;
    //   node.prev = this.prev;
    // }
    this.prev = node;
  }
  getNext() {
    if (!this.next || this.next.num !== this.num + 1) {
      this.insertAfter(new FreqItem(this.num + 1));
    }
    return this.next;
  }
  insertAfter(node) {
    node.prev = this;
    if (this.next) {
      this.next.prev = node;
      node.next = this.next;
    }
    this.next = node;
  }
}
class List {
  constructor() {
    this.root = new FreqItem(1);
    this.length = 0;
  }
  insert(value) {
    // console.log('add', value);
    this.length++;
    // if (!this.root) {
    //   this.root = new FreqItem(1);
    // }
    if (this.root.num !== 1) {
      let newRoot = new FreqItem(1);
      this.root.insertBefore(newRoot);
      this.root = newRoot;
    }
    let item = new Item(value, this.root, this);
    return item;
  }
  removeFreq(node) {
    if (this.root === node) {
      if (node.next === null) {
        this.root = new  FreqItem(1);
        return;
      }
      this.root = node.next;
      this.root.prev = null;
      return;
    }
    // console.log('this', this);
    // console.log('node', node);
    let prev = node.prev;
    let next = node.next;
    prev.next = next;
    if (next) {
      next.prev = prev;
    }
  }
  tail() {
    return this.root.head;
  }
  remove(node) {
    // console.log('remove', node.value);
    this.length--;
    var freq = node.freq;
    freq.removeItem(node);
    if (!freq.head && !freq.tail) {
      this.removeFreq(freq);
    }
  }
  forEach(fn, self) {
    self = self || this;
    this.forEachRaw((node, i) => {
      fn.call(self, node.value, i, this);
    })
  }
  forEachRaw(fn, self) {
    let freq = this.root;
    let node = freq.head;
    self = self || this;
    var i = -1;
    while (node) {
      fn.call(self, node, ++i, this);
      if (node.next) {
        node = node.next;
        continue;
      }
      if (freq.next) {
        freq = freq.next;
        node = freq.head;
        continue;
      }
      return;
    }
  }
  toArray() {
    let out = new Array(this.length);
    this.forEach(function (node, i) {
      // console.log(value, i);
      out[i] = node;
    });
    return out;
  }
}

module.exports = List;
