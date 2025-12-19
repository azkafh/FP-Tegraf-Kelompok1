import { KnightTour } from './warnsdorff.js';
import { Visualizer } from './visualizer.js';

const visualizer = new Visualizer();
let startPos = null;
let isRunning = false;

function init() {
    visualizer.drawBoard((r, c, tile) => {
        if (isRunning) return;
        visualizer.reset();
        
        // Visual feedback untuk posisi awal
        const tiles = document.querySelectorAll('.tile');
        tiles.forEach(t => t.classList.remove('visited', 'current'));
        tile.classList.add('current');
        tile.innerHTML = '<i class="fas fa-chess-knight"></i>';
        
        startPos = { r, c };
    });

    document.getElementById('btnStart').addEventListener('click', runTour);
    document.getElementById('btnReset').addEventListener('click', () => {
        if (isRunning) location.reload(); // Simple reset
        visualizer.reset();
        visualizer.drawBoard();
        startPos = null;
    });
}

async function runTour() {
    if (!startPos || isRunning) {
        alert("Silakan pilih kotak awal di papan terlebih dahulu!");
        return;
    }

    isRunning = true;
    const tour = new KnightTour(startPos.r, startPos.c);
    const fullPath = tour.solve();
    const speed = 550 - document.getElementById('speedRange').value;

    for (let i = 0; i < fullPath.length; i++) {
        const step = fullPath[i];
        
        if (i > 0) {
            const prev = fullPath[i - 1];
            visualizer.drawLine(prev.r, prev.c, step.r, step.c);
        }

        visualizer.updateStep(step.r, step.c, fullPath.slice(0, i + 1));
        await new Promise(resolve => setTimeout(resolve, speed));
    }

    isRunning = false;
}

init();