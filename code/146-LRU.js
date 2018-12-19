/*
* LRU算法实现
* 链表：rear进front出
* */
class LRUCache {
  constructor (capacity) {
    this.capacity = capacity
    this.front = null
    this.rear = null
    this.keys = new Set()
    this.list = {}
    // 用于生产uid
    this.tempIndex = 0
  }
  put (k, v) {
    // 如果key存在
    if (this.keys.has(k)) {
      // 更新到队尾
      this.moveToRear(k)
    } else { // 如果key不存在
      // 缓存已满
      if (this.keys.size >= this.capacity) {
        // front key 缓存
        let key = this.front.key
        // 删除队首项
        this.moveSecondToFront()
        // 删除列表list和keys set
        delete this.list[key]
        this.keys.delete(key)
      }
      // 添加新项目
      this.list[k] = this.getItemByValue(k, v)
      this.addToRear(k)
      // 缓存刚刚为空
      if (this.keys.size === 0) {
        this.front = this.list[k]
      }
      this.keys.add(k)
    }
  }
  get (k) {
    // 如果key存在
    if (this.keys.has(k)) {
      this.moveToRear(k)
      return this.list[k].value
    }
    // 如果key不存在
    return -1
  }
  // 删除队首项
  moveSecondToFront () {
    let second = this.front.next
    if (second) {
      second.prev = null
      this.front = second
    }
  }
  // 修改指针链
  moveToRear (k) {
    let currentItem = this.list[k]
    let next = currentItem.next
    // 当前项正在队尾，不处理
    if (!next) return
    // 修改前一项和后一项指针
    let prev = currentItem.prev
    // currentItem为队首项目，需要删除队首项目
    if (!prev) {
      this.moveSecondToFront()
    } else {
      prev.next = next
      next.prev = prev
    }

    // 当前项添加到队尾
    this.addToRear(k)
  }
  // 当前项放到队尾
  addToRear (k) {
    // 缓存不为空，存在项目
    if (this.rear) {
      // 更新当前项prev指针
      this.list[k].prev = this.rear
      // 更新上一rear的next指针
      this.rear.next = this.list[k]
    }
    this.list[k].next = null
    // 更新当前rear指针指向到新加项
    this.rear = this.list[k]
  }
  // 初始化缓存项
  getItemByValue (k, v) {
    return {
      uid: this.getUid(),
      // 缓存key，方便操作keys set
      key: k,
      value: v,
      prev: null,
      next: null
    }
  }
  getUid () {
    const uid = Date.now() + this.tempIndex++
    return uid
  }
}

let cache = new LRUCache(2)
let res
res = cache.put(1, 1)
res = cache.put(2, 2)
res = cache.get(1) // 返回  1
res = cache.put(3, 3) // 该操作会使得密钥 2 作废
res = cache.get(2) // 返回 -1 (未找到)
res = cache.put(4, 4) // 该操作会使得密钥 1 作废
res = cache.get(1) // 返回 -1 (未找到)
res = cache.get(3) // 返回  3
res = cache.get(4) // 返回  4
console.log(res)
