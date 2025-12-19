# How to Use Program
[Access Here](https://algorithm-visualizer-sooty-kappa.vercel.app/)

# Knight’s Tour Problem

## Algoritma 

### 1. Backtracking (Depth-First Search)
Algoritma mencoba setiap langkah kuda secara rekursif.  
Jika suatu langkah menyebabkan buntu, algoritma akan **mundur (backtrack)** dan mencoba langkah lain.

Tujuan:
- Menjamin semua kotak dikunjungi tepat satu kali
- Menemukan solusi jika solusi memang ada

```js
  for (const move of moves) {
    board[move.x][move.y] = moveCount
    path.push({ x: move.x, y: move.y })

    if (this.dfs(move.x, move.y, moveCount + 1, board, path, mode, startX, startY)) {
      return true
    }

    // backtrack
    board[move.x][move.y] = -1
    path.pop()
  }
```

### 2. Warnsdorff’s Heuristic
Pada setiap langkah, algoritma memilih kotak tujuan yang memiliki **jumlah langkah lanjutan paling sedikit**.

Tujuan:
- Menghindari dead-end lebih awal
- Mengurangi jumlah backtracking
- Mempercepat pencarian solusi

Jika terdapat derajat yang sama, dilakukan **randomisasi kecil** agar tidak terjebak pola kegagalan yang sama.

```js
moves.sort((a, b) => a.degree - b.degree)
```

```js
this.shuffle(moves)
```

---

## Open Tour
- Solusi dianggap valid ketika **semua kotak telah dikunjungi**
- Tidak ada syarat tambahan pada posisi akhir

```js
if (moveCount === size * size) return true
```

## Closed Tour
- Semua kotak harus dikunjungi
- Posisi terakhir harus dapat kembali ke posisi awal dengan satu langkah kuda

```js
if (moveCount === size * size) {
  return isKnightMove(lastX, lastY, startX, startY)
}
```
---

# Largest Increasing Subsequence Problem

## Algoritma dan Fungsi

### Breadth-First Search (BFS)
Algoritma menggunakan **queue** untuk melakukan traversal pohon keputusan secara **level-by-level**.

```js
const queue = [root]

while (queue.length > 0) {
  const currentNode = queue.shift()
  ...
  queue.push(childNode)
}
```
### Memastikan Increasing
Tujuan fungsi ini memastikan:
- Tidak ada nilai menurun (decreasing)
- Tidak ada nilai sama (strictly increasing)

```js
canAddToSequence(sequence, value) {
  if (sequence.length === 0) return true
  return value > sequence[sequence.length - 1]
}
```
### Largest Increasing Subsequence
Setiap node yang terbentuk dibandingkan panjang subsequencenya.
Node dengan subsequence terpanjang akan disimpan sebagai solusi LIS.

```js
if (childNode.sequence.length > this.maxLength) {
  this.maxLength = childNode.sequence.length
  this.optimalPath = this.getPathToNode(childNode)
}
```