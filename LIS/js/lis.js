export class LISAlgorithm {
  constructor(sequence) {
    this.sequence = sequence
    this.tree = null
    this.visitOrder = []
    this.optimalPath = []
    this.maxLength = 0
  }

  //build tree
  buildTree() {
    const root = {
      id: 0,
      value: null,
      sequence: [],
      level: 0,
      children: [],
      parent: null,
    }

    let nodeIdCounter = 1
    const queue = [root]
    this.visitOrder = []

    while (queue.length > 0) {
      const currentNode = queue.shift()

      this.visitOrder.push({
        node: currentNode,
        currentPath: this.getPathToNode(currentNode),
      })

      const currentLevel = currentNode.level
      if (currentLevel >= this.sequence.length) continue

      for (let i = currentLevel; i < this.sequence.length; i++) {
        const nextValue = this.sequence[i]

        if (this.canAddToSequence(currentNode.sequence, nextValue)) {
          const childNode = {
            id: nodeIdCounter++,
            value: nextValue,
            sequence: [...currentNode.sequence, nextValue],
            level: i + 1,
            children: [],
            parent: currentNode,
          }
      
          currentNode.children.push(childNode)
          queue.push(childNode)

          if (childNode.sequence.length > this.maxLength) {
            this.maxLength = childNode.sequence.length
            this.optimalPath = this.getPathToNode(childNode)
          }
        }
      }
    }

    this.tree = root
    return root
  }

  canAddToSequence(sequence, value) {
  if (sequence.length === 0) return true
  return value > sequence[sequence.length - 1]
}

  // Get path from root to a specific node
  getPathToNode(node) {
    const path = []
    let current = node

    while (current !== null) {
      path.unshift(current)
      current = current.parent
    }

    return path
  }

  // Get the longest sequence
  getOptimalPath() {
    return this.optimalPath
  }

  getVisitOrder() {
    return this.visitOrder
  }

  getResult() {
    if (this.optimalPath.length > 1) {
      const resultSequence = this.optimalPath
        .slice(1)
        .map((node) => node.value)

      return {
        length: resultSequence.length,
        sequence: resultSequence,
      }
    }

    return {
      length: 0,
      sequence: [],
    }
  }
}
