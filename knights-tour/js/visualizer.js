import { BOARD_SIZE } from './config.js';

export class Visualizer {
    constructor() {
        this.boardElem = document.getElementById('chessboard');
        this.lineLayer = document.getElementById('lineLayer');
        this.nodePathElem = document.getElementById('nodePath');
    }

    drawBoard(onTileClick) {
        this.boardElem.innerHTML = '';
        for (let r = 0; r < BOARD_SIZE; r++) {
            for (let c = 0; c < BOARD_SIZE; c++) {
                const tile = document.createElement('div');
                tile.className = `tile ${(r + c) % 2 === 0 ? 'light' : 'dark'}`;
                tile.dataset.row = r;
                tile.dataset.col = c;
                tile.addEventListener('click', () => onTileClick(r, c, tile));
                this.boardElem.appendChild(tile);
            }
        }
    }

    updateStep(r, c, pathSoFar) {
        const tiles = this.boardElem.querySelectorAll('.tile');
        const idx = (r * BOARD_SIZE) + c;
        
        // Bersihkan icon kuda sebelumnya
        tiles.forEach(t => {
            t.classList.remove('current');
            t.innerHTML = '';
        });

        const currentTile = tiles[idx];
        currentTile.classList.add('visited', 'current');
        currentTile.innerHTML = '<i class="fas fa-chess-knight"></i>';

        this.nodePathElem.innerText = pathSoFar.map(p => p.tileIndex).join(' → ');
        this.nodePathElem.scrollTop = this.nodePathElem.scrollHeight;
    }

    drawLine(r1, c1, r2, c2) {
        const size = 60; // Sesuai CSS
        const offset = size / 2;
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        
        line.setAttribute('x1', c1 * size + offset);
        line.setAttribute('y1', r1 * size + offset);
        line.setAttribute('x2', c2 * size + offset);
        line.setAttribute('y2', r2 * size + offset);
        line.setAttribute('class', 'path-line');
        
        this.lineLayer.appendChild(line);
    }

    reset() {
        this.lineLayer.innerHTML = '';
        this.nodePathElem.innerText = 'Waiting for start...';
    }
}