import KnightTour from "./knightTour.js"
import KnightAnimation from "./animation.js"

console.log("[v0] Knight Tour app initializing...")

class KnightTourApp {
  constructor() {
    console.log("[v0] KnightTourApp constructor called")
    this.boardSize = 8
    this.startPosition = null
    this.tourType = "open"
    this.speed = 3.0
    this.isAnimating = false

    this.knightTour = new KnightTour(this.boardSize)
    this.initializeElements()
    this.createChessboard()
    this.animation = new KnightAnimation(this.chessboard, this.lineCanvas, this.boardSize)
    this.attachEventListeners()
    console.log("[v0] KnightTourApp initialized successfully")
  }

  initializeElements() {
    console.log("[v0] Initializing DOM elements...")
    this.chessboard = document.getElementById("chessboard")
    this.lineCanvas = document.getElementById("lineCanvas")
    this.openTourBtn = document.getElementById("openTourBtn")
    this.closedTourBtn = document.getElementById("closedTourBtn")
    this.generateBtn = document.getElementById("generateBtn")
    this.resetBtn = document.getElementById("resetBtn")
    this.pathDisplay = document.getElementById("pathDisplay")

    console.log("[v0] Chessboard element:", this.chessboard)
  }

  createChessboard() {
    console.log("[v0] Creating chessboard...")
    this.chessboard.innerHTML = ""
    for (let row = 0; row < this.boardSize; row++) {
      for (let col = 0; col < this.boardSize; col++) {
        const tile = document.createElement("div")
        tile.className = `tile ${(row + col) % 2 === 0 ? "light" : "dark"}`
        tile.dataset.row = row
        tile.dataset.col = col
        tile.addEventListener("click", () => this.handleTileClick(row, col))
        this.chessboard.appendChild(tile)
      }
    }
    console.log("[v0] Chessboard created with", this.chessboard.children.length, "tiles")
  }

  handleTileClick(row, col) {
    if (this.isAnimating) return

    this.startPosition = { row, col }

    const tiles = this.chessboard.querySelectorAll(".tile")
    tiles.forEach((tile) => {
      tile.textContent = ""
      tile.innerHTML = ""
      tile.classList.remove("visited", "current")
    })

    const tileIndex = row * this.boardSize + col
    const tile = this.chessboard.children[tileIndex]
    tile.textContent = "♞"
    tile.classList.add("current")

    this.animation.clearCanvas()
    this.pathDisplay.textContent = `Starting position: Tile ${tileIndex + 1}`
  }

  attachEventListeners() {
    this.openTourBtn.addEventListener("click", () => {
      this.tourType = "open"
      this.openTourBtn.classList.add("active")
      this.closedTourBtn.classList.remove("active")
    })

    this.closedTourBtn.addEventListener("click", () => {
      this.tourType = "closed"
      this.closedTourBtn.classList.add("active")
      this.openTourBtn.classList.remove("active")
    })

    this.generateBtn.addEventListener("click", () => this.generate())
    this.resetBtn.addEventListener("click", () => this.reset())
  }

  async generate() {
    if (!this.startPosition) {
      alert("Please select a starting position by clicking on a tile!")
      return
    }

    if (this.isAnimating) return

    this.isAnimating = true
    this.generateBtn.disabled = true

    this.reset(false)

    const { row, col } = this.startPosition
    const isClosed = this.tourType === "closed"

    const solved = this.knightTour.solve(row, col, isClosed)

    if (!solved) {
      alert("No solution found for this starting position!")
      this.isAnimating = false
      this.generateBtn.disabled = false
      return
    }

    const path = this.knightTour.getPath()

    await this.animation.animatePath(path, this.speed, (index, position) => {
      const tileNumbers = path.slice(0, index + 1).map((p) => {
        return p.x * this.boardSize + p.y + 1
      })
      this.pathDisplay.textContent = tileNumbers.join(" → ")
    })

    this.isAnimating = false
    this.generateBtn.disabled = false
  }

  reset(clearStart = true) {
    if (this.isAnimating) return

    const tiles = this.chessboard.querySelectorAll(".tile")
    tiles.forEach((tile) => {
      tile.classList.remove("visited", "current")
      if (clearStart) {
        tile.textContent = ""
        tile.innerHTML = ""
      }
    })

    this.animation.clearCanvas()

    if (clearStart) {
      this.startPosition = null
      this.pathDisplay.textContent = "Click a tile to start"
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("[v0] DOM Content Loaded")
  new KnightTourApp()
})
