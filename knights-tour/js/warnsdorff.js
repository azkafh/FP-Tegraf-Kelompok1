import { BOARD_SIZE, MOVES } from './config.js';

export class KnightTour {
    constructor(startR, startC) {
        this.startR = startR;
        this.startC = startC;
        this.visited = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(false));
    }

    getDegree(r, c, visited) {
        let count = 0;
        for (const [dr, dc] of MOVES) {
            const nr = r + dr;
            const nc = c + dc;
            if (this.isValid(nr, nc) && !visited[nr][nc]) count++;
        }
        return count;
    }

    isValid(r, c) {
        return r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE;
    }

    // Menghasilkan seluruh path sekaligus
    solve() {
        let r = this.startR;
        let c = this.startC;
        const path = [];

        for (let step = 1; step <= BOARD_SIZE * BOARD_SIZE; step++) {
            this.visited[r][c] = true;
            path.push({ r, c, tileIndex: (r * BOARD_SIZE) + c + 1 });

            if (step === BOARD_SIZE * BOARD_SIZE) break;

            let minDeg = 9;
            let nextMove = null;

            for (const [dr, dc] of MOVES) {
                const nr = r + dr;
                const nc = c + dc;

                if (this.isValid(nr, nc) && !this.visited[nr][nc]) {
                    const deg = this.getDegree(nr, nc, this.visited);
                    if (deg < minDeg) {
                        minDeg = deg;
                        nextMove = { nr, nc };
                    }
                }
            }

            if (!nextMove) break;
            r = nextMove.nr;
            c = nextMove.nc;
        }
        return path;
    }
}