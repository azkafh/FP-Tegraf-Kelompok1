export class TreeAnimator {
  constructor(svgElement) {
    this.svg = svgElement
    this.nodes = new Map()
    this.edges = new Map()
    this.isAnimating = false
    this.animationSpeed = 800
    this.bestSoFar = []
  }

  calculateLayout(root) {
    const positions = new Map()
    const levelHeight = 100
    const horizontalSpacing = 80

    const calculateWidth = (node) => {
      if (!node.children || node.children.length === 0) return 1
      return node.children.reduce((sum, c) => sum + calculateWidth(c), 0)
    }

    const positionNode = (node, x, y, width) => {
      positions.set(node.id, { x, y })

      if (!node.children || node.children.length === 0) return

      let currentX = x - (width * horizontalSpacing) / 2
      for (const child of node.children) {
        const childWidth = calculateWidth(child)
        const childX =
          currentX + (childWidth * horizontalSpacing) / 2

        positionNode(
          child,
          childX,
          y + levelHeight,
          childWidth
        )

        currentX += childWidth * horizontalSpacing
      }
    }

    const totalWidth = calculateWidth(root)
    positionNode(root, (totalWidth * horizontalSpacing) / 2, 50, totalWidth)

    return positions
  }

  drawTree(root) {
    this.svg.innerHTML = ""
    this.nodes.clear()
    this.edges.clear()
    this.bestSoFar = []

    const positions = this.calculateLayout(root)

    let maxX = 0,
      maxY = 0
    positions.forEach((p) => {
      maxX = Math.max(maxX, p.x)
      maxY = Math.max(maxY, p.y)
    })

    this.svg.setAttribute("width", Math.max(800, maxX + 100))
    this.svg.setAttribute("height", maxY + 100)

    this.drawEdges(root, positions)
    this.drawNodes(root, positions)
  }

  drawEdges(root, positions) {
    const traverse = (node) => {
      for (const child of node.children || []) {
        const p = positions.get(node.id)
        const c = positions.get(child.id)

        const line = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "line"
        )
        line.setAttribute("x1", p.x)
        line.setAttribute("y1", p.y + 25)
        line.setAttribute("x2", c.x)
        line.setAttribute("y2", c.y - 25)
        line.classList.add("tree-edge")

        const id = `edge-${node.id}-${child.id}`
        line.setAttribute("id", id)

        this.svg.appendChild(line)
        this.edges.set(id, line)

        traverse(child)
      }
    }

    traverse(root)
  }

  drawNodes(root, positions) {
    const traverse = (node) => {
      const { x, y } = positions.get(node.id)

      const g = document.createElementNS("http://www.w3.org/2000/svg", "g")
      g.classList.add("tree-node")
      g.setAttribute("id", `node-${node.id}`)

      const circle = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
      )
      circle.setAttribute("cx", x)
      circle.setAttribute("cy", y)
      circle.setAttribute("r", 25)

      const text = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      )
      text.setAttribute("x", x)
      text.setAttribute("y", y)
      text.textContent = node.value ?? "○"

      g.appendChild(circle)
      g.appendChild(text)

      if (node.sequence.length > 0) {
        const label = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "text"
        )
        label.setAttribute("x", x)
        label.setAttribute("y", y + 45)
        label.classList.add("tree-node-label")
        label.textContent = `[${node.sequence.join(",")}]`
        g.appendChild(label)
      }

      this.svg.appendChild(g)
      this.nodes.set(node.id, g)

      for (const child of node.children || []) traverse(child)
    }

    traverse(root)
  }

  async animateTraversal(visitOrder, optimalPath) {
    this.isAnimating = true
    this.bestSoFar = []

    for (const step of visitOrder) {
      if (!this.isAnimating) break

      const { node, currentPath } = step
      const nodeEl = this.nodes.get(node.id)
      if (!nodeEl) continue

      let edgeEl = null
      if (node.parent) {
        edgeEl = this.edges.get(
          `edge-${node.parent.id}-${node.id}`
        )
        if (edgeEl && !edgeEl.classList.contains("path")) {
          edgeEl.classList.add("visited")
        }
      }

      await this.sleep(this.animationSpeed)

      if (!nodeEl.classList.contains("path")) {
        nodeEl.classList.add("visited")
      }

      // Update best so far
      if (currentPath.length > this.bestSoFar.length) {
        this.clearCurrentBest()
        this.bestSoFar = [...currentPath]
        this.highlightPath(this.bestSoFar)
      }
    }

    await this.sleep(500)
    this.clearCurrentBest()
    this.highlightOptimalPath(optimalPath)

    this.isAnimating = false
  }

  highlightPath(path) {
    for (let i = 0; i < path.length; i++) {
      const nodeEl = this.nodes.get(path[i].id)
      if (nodeEl) nodeEl.classList.add("path")

      if (i > 0) {
        const edge = this.edges.get(
          `edge-${path[i - 1].id}-${path[i].id}`
        )
        if (edge) edge.classList.add("path")
      }
    }
  }

  highlightOptimalPath(path) {
    this.highlightPath(path)
  }

  clearCurrentBest() {
    this.svg.querySelectorAll(".path").forEach((el) =>
      el.classList.remove("path")
    )
  }

  stopAnimation() {
    this.isAnimating = false
  }

  sleep(ms) {
    return new Promise((r) => setTimeout(r, ms))
  }

  reset() {
    this.stopAnimation()
    this.nodes.clear()
    this.edges.clear()
    this.bestSoFar = []
    this.svg.innerHTML = ""
  }
}
