// 1. Configuración de credenciales
const url = 'https://cwfphtmfjdkmxfgcnzqn.supabase.co';
const key = 'sb_publishable_dzJCdUmHzy_WORKHRzFM8w_OSaHvVYF';

// 2. Creación del cliente (Usamos nombres de variables distintos para evitar conflictos)
const supabaseClient = window.supabase.createClient(url, key);

// 3. Verificación en consola (Para estar seguros de que cargó)
console.log('Cliente de Supabase creado:', supabaseClient);

// 4. Inicialización del mapa
// IMPORTANTE: Asegúrate de que el div con id="map" tenga altura en tu CSS
var map = L.map('map').setView([25.592305, -103.461611], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Function to save marker
async function saveMarker(lat, lng) {
    console.log('Saving marker:', lat, lng);
    // Cambiamos 'markers' por 'Places'
    const { data, error } = await supabase
        .from('Places') 
        .insert([{ lat, lng }]); 

    if (error) {
        console.error('Error saving marker:', error);
    } else {
        console.log('Marker saved:', data);
    }
}


// Function to load markers
async function loadMarkers() {
    console.log('Loading markers...');
    const { data, error } = await supabase
        .from('markers')
        .select('*');
    if (error) {
        console.error('Error loading markers:', error);
    } else {
        console.log('Markers loaded:', data);
        data.forEach(marker => {
            L.marker([marker.lat, marker.lng]).addTo(map);
        });
    }
}

// Load existing markers on map init
loadMarkers();

// Add click event to add markers
map.on('click', function(e) {
    const marker = L.marker(e.latlng).addTo(map);
    saveMarker(e.latlng.lat, e.latlng.lng);
});

// Add initial marker
L.marker([25.592305, -103.461611]).addTo(map)
    .bindPopup('¡Aquí estoy!')
    .openPopup();
