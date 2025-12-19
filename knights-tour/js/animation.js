class KnightAnimation {
  constructor(chessboard, canvas, size = 8) {
    this.chessboard = chessboard
    this.canvas = canvas
    this.ctx = canvas.getContext("2d")
    this.size = size
    this.tileSize = 70
    this.setupCanvas()
  }

  setupCanvas() {
    this.canvas.width = this.size * this.tileSize + (this.size - 1) * 2
    this.canvas.height = this.size * this.tileSize + (this.size - 1) * 2
  }

  getTileCenter(row, col) {
    const x = col * (this.tileSize + 2) + this.tileSize / 2
    const y = row * (this.tileSize + 2) + this.tileSize / 2
    return { x, y }
  }

  drawLine(fromRow, fromCol, toRow, toCol) {
    const from = this.getTileCenter(fromRow, fromCol)
    const to = this.getTileCenter(toRow, toCol)

    this.ctx.strokeStyle = "#a2d2ff"
    this.ctx.lineWidth = 3
    this.ctx.lineCap = "round"

    this.ctx.beginPath()
    this.ctx.moveTo(from.x, from.y)
    this.ctx.lineTo(to.x, to.y)
    this.ctx.stroke()

    this.ctx.fillStyle = "#a2d2ff"
    this.ctx.beginPath()
    this.ctx.arc(to.x, to.y, 5, 0, Math.PI * 2)
    this.ctx.fill()
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  async animatePath(path, speed, onStep) {
    this.clearCanvas()
    const delay = 1000 / speed

    for (let i = 0; i < path.length; i++) {
      const current = path[i]
      const tileIndex = current.x * this.size + current.y
      const tile = this.chessboard.children[tileIndex]

      if (i > 0) {
        const prevIndex = path[i - 1].x * this.size + path[i - 1].y
        const prevTile = this.chessboard.children[prevIndex]
        prevTile.textContent = ""
        const visitNumber = document.createElement("span")
        visitNumber.className = "visit-number"
        visitNumber.textContent = i
        prevTile.appendChild(visitNumber)
        prevTile.classList.add("visited")
        prevTile.classList.remove("current")
      }

      tile.classList.add("current")
      tile.textContent = "♞"

      if (onStep) {
        onStep(i, current)
      }

      await this.sleep(delay)

      if (i > 0) {
        const prev = path[i - 1]
        this.drawLine(prev.x, prev.y, current.x, current.y)
      }

      await this.sleep(delay / 2)
    }

    const lastIndex = path[path.length - 1].x * this.size + path[path.length - 1].y
    const lastTile = this.chessboard.children[lastIndex]
    lastTile.textContent = ""
    const lastNumber = document.createElement("span")
    lastNumber.className = "visit-number"
    lastNumber.textContent = path.length
    lastTile.appendChild(lastNumber)
    lastTile.classList.add("visited")
    lastTile.classList.remove("current")
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}

export default KnightAnimation
