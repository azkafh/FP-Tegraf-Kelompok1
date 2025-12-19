document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', function(e) {
        // Efek transisi sebelum pindah halaman bisa ditambahkan di sini
        console.log(`Navigasi ke: ${this.getAttribute('href')}`);
    });
});