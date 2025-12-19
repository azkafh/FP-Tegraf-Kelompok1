class KnightTour {
  constructor(size = 8) {
    this.size = size
    this.board = Array(size)
      .fill(null)
      .map(() => Array(size).fill(-1))
    this.moveX = [2, 1, -1, -2, -2, -1, 1, 2]
    this.moveY = [1, 2, 2, 1, -1, -2, -2, -1]
    this.path = []
  }

  isValid(x, y) {
    return x >= 0 && x < this.size && y >= 0 && y < this.size && this.board[x][y] === -1
  }

  getDegree(x, y) {
    let count = 0
    for (let i = 0; i < 8; i++) {
      const nextX = x + this.moveX[i]
      const nextY = y + this.moveY[i]
      if (this.isValid(nextX, nextY)) {
        count++
      }
    }
    return count
  }

  solveKnightTour(startX, startY, isClosed = false) {
    this.board = Array(this.size)
      .fill(null)
      .map(() => Array(this.size).fill(-1))
    this.path = []
    this.board[startX][startY] = 0
    this.path.push({ x: startX, y: startY, step: 0 })

    if (this.solveKnightTourUtil(startX, startY, 1)) {
      if (isClosed) {
        return this.checkClosedTour(startX, startY)
      }
      return true
    }
    return false
  }

  solveKnightTourUtil(x, y, moveCount) {
    if (moveCount === this.size * this.size) {
      return true
    }

    const nextMoves = []
    for (let i = 0; i < 8; i++) {
      const nextX = x + this.moveX[i]
      const nextY = y + this.moveY[i]
      if (this.isValid(nextX, nextY)) {
        const degree = this.getDegree(nextX, nextY)
        nextMoves.push({ x: nextX, y: nextY, degree })
      }
    }

    nextMoves.sort((a, b) => a.degree - b.degree)

    for (const move of nextMoves) {
      this.board[move.x][move.y] = moveCount
      this.path.push({ x: move.x, y: move.y, step: moveCount })

      if (this.solveKnightTourUtil(move.x, move.y, moveCount + 1)) {
        return true
      }

      this.board[move.x][move.y] = -1
      this.path.pop()
    }

    return false
  }

  checkClosedTour(startX, startY) {
    const lastPos = this.path[this.path.length - 1]
    for (let i = 0; i < 8; i++) {
      const nextX = lastPos.x + this.moveX[i]
      const nextY = lastPos.y + this.moveY[i]
      if (nextX === startX && nextY === startY) {
        return true
      }
    }
    return false
  }

  getPath() {
    return this.path
  }
}

export default KnightTour
