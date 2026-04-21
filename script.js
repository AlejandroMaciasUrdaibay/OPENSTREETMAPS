// Initialize Supabase
const supabaseUrl = 'https://cwfphtmfjdkmxfgcnzqn.supabase.co';
const supabaseKey = '';"sb_publishable_dzJCdUmHzy_WORkHRzFM8w_OSaHvVYF"
console.log('supabase available:', typeof window.supabase);
const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);
console.log('Supabase initialized:', supabase);

// Initialize the map
var map = L.map('map').setView([25.592305, -103.461611], 13); // Coordinates provided by user

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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
