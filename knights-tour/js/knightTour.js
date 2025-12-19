class KnightTour {
  constructor(size = 8) {
    this.size = size
    this.moveX = [2, 1, -1, -2, -2, -1, 1, 2]
    this.moveY = [1, 2, 2, 1, -1, -2, -2, -1]
    this.maxTries = 200
    this.path = []
  }

  initBoard() {
    this.board = Array(this.size)
      .fill(null)
      .map(() => Array(this.size).fill(-1))
    this.path = []
  }

  isValid(x, y) {
    return (
      x >= 0 &&
      x < this.size &&
      y >= 0 &&
      y < this.size &&
      this.board[x][y] === -1
    )
  }

  degree(x, y) {
    let count = 0
    for (let i = 0; i < 8; i++) {
      const nx = x + this.moveX[i]
      const ny = y + this.moveY[i]
      if (this.isValid(nx, ny)) count++
    }
    return count
  }

  isKnightMove(x1, y1, x2, y2) {
    const dx = Math.abs(x1 - x2)
    const dy = Math.abs(y1 - y2)
    return (dx === 2 && dy === 1) || (dx === 1 && dy === 2)
  }

  solve(startX, startY, isClosed = false) {
    for (let attempt = 0; attempt < this.maxTries; attempt++) {
      this.initBoard()
      this.startX = startX
      this.startY = startY

      this.board[startX][startY] = 0
      this.path.push({ x: startX, y: startY })

      if (this.dfs(startX, startY, 1, isClosed)) {
        return true
      }
    }
    return false
  }

  dfs(x, y, moveCount, isClosed) {
    if (moveCount === this.size * this.size) {
      if (!isClosed) return true
      return this.isKnightMove(x, y, this.startX, this.startY)
    }

    let moves = []
    for (let i = 0; i < 8; i++) {
      const nx = x + this.moveX[i]
      const ny = y + this.moveY[i]
      if (this.isValid(nx, ny)) {
        moves.push({
          x: nx,
          y: ny,
          degree: this.degree(nx, ny),
        })
      }
    }

    // Warnsdorff 
    moves.sort((a, b) => a.degree - b.degree)

    if (!isClosed) {
      for (let i = moves.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[moves[i], moves[j]] = [moves[j], moves[i]]
      }
    }

    for (const m of moves) {
      this.board[m.x][m.y] = moveCount
      this.path.push({ x: m.x, y: m.y })

      if (this.dfs(m.x, m.y, moveCount + 1, isClosed)) {
        return true
      }

      // backtrack
      this.board[m.x][m.y] = -1
      this.path.pop()
    }

    return false
  }

  getPath() {
    return this.path
  }
}

export default KnightTour
