import { LISAlgorithm } from "./lis.js"
import { TreeAnimator } from "./animation.js"

class LISVisualization {
  constructor() {
    this.mode = "increasing"
    this.isRunning = false
    this.algorithm = null
    this.animator = null

    this.initializeElements()
    this.attachEventListeners()
  }

  initializeElements() {
    this.sequenceInput = document.getElementById("sequenceInput")
    this.generateBtn = document.getElementById("generateBtn")
    this.resetBtn = document.getElementById("resetBtn")
    this.sequenceLengthEl = document.getElementById("sequenceLength")
    this.longestSequenceEl = document.getElementById("longestSequence")
    this.svgElement = document.getElementById("treeSVG")
    this.animator = new TreeAnimator(this.svgElement)
  }

  attachEventListeners() {
    this.generateBtn.addEventListener("click", () => this.startVisualization())
    
    this.resetBtn.addEventListener("click", () => this.reset())

    this.sequenceInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && !this.isRunning) {
        this.startVisualization()
      }
    })
  }

  parseSequence(inputString) {
    const numbers = inputString
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s !== "")
      .map((s) => Number.parseInt(s))
      .filter((n) => !isNaN(n))

    return numbers
  }

  validateSequence(sequence) {
    if (sequence.length === 0) {
      alert("Please enter at least one number")
      return false
    }

    if (sequence.length > 10) {
      alert("Maximum 10 elements allowed")
      return false
    }

    return true
  }

  async startVisualization() {
    if (this.isRunning) return

    const sequence = this.parseSequence(this.sequenceInput.value)

    if (!this.validateSequence(sequence)) {
      return
    }

    this.isRunning = true
    this.generateBtn.disabled = true
    this.generateBtn.innerHTML = '<span class="play-icon">⏸</span> Running...'

    this.sequenceLengthEl.textContent = "-"
    this.longestSequenceEl.textContent = "-"

    this.algorithm = new LISAlgorithm(sequence, this.mode)

    const root = this.algorithm.buildTree()
    const visitOrder = this.algorithm.getVisitOrder()
    const optimalPath = this.algorithm.getOptimalPath()

    this.animator.reset()
    this.animator.drawTree(root)

    await this.animator.animateTraversal(visitOrder, optimalPath)

    const result = this.algorithm.getResult()
    this.sequenceLengthEl.textContent = result.length
    this.longestSequenceEl.textContent = result.sequence.length > 0 ? result.sequence.join(", ") : "No sequence found"

    this.isRunning = false
    this.generateBtn.disabled = false
    this.generateBtn.innerHTML = '<span class="play-icon">▶</span> Start'
  }

  reset() {
    if (this.animator) {
      this.animator.stopAnimation()
    }

    // Reset UI
    this.isRunning = false
    this.generateBtn.disabled = false
    this.generateBtn.innerHTML = '<span class="play-icon">▶</span> Start'

    // Reset results
    this.sequenceLengthEl.textContent = "-"
    this.longestSequenceEl.textContent = "-"

    // Clear visualization
    if (this.animator) {
      this.animator.reset()
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new LISVisualization()
})
