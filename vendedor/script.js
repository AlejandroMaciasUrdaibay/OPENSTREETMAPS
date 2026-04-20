// Initialize the map
var map = L.map('map').setView([25.592305, -103.461611], 13); // Coordinates provided by user

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Add a marker
L.marker([25.592305, -103.461611]).addTo(map)
    .bindPopup('¡Aquí estoy!')
    .openPopup();

// Add random locations for talleres
for (let i = 1; i <= 3; i++) {
    let latOffset = (Math.random() - 0.5) * 0.02; // Random offset between -0.01 and 0.01
    let lonOffset = (Math.random() - 0.5) * 0.02;
    let lat = 25.592305 + latOffset;
    let lon = -103.461611 + lonOffset;
    L.marker([lat, lon]).addTo(map)
        .bindPopup('Taller ' + i);
}
