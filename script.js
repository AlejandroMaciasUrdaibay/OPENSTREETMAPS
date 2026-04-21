// 1. Configuración de conexión
// Asegúrate de que estas credenciales coincidan con las de tu panel de Supabase
const url = 'https://cwfphtmfjdkmxfgcnzqn.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3ZnBodG1mamRrbXhmZ2NuenFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3NzYyMDAsImV4cCI6MjA5MjM1MjIwMH0.hlwisoZ-B6gnRdSplxukft0mb7QHaRwqsriAQ8vT51U';
const supabaseClient = window.supabase.createClient(url, key);

// 2. Inicialización del Mapa
// Nota: El div en tu HTML debe tener id="map"
var map = L.map('map').setView([25.592305, -103.461611], 13);

// Usamos capas de OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// 3. Función para CARGAR marcadores desde la base de datos
async function loadMarkers() {
    console.log("Consultando marcadores existentes...");
    const { data, error } = await supabaseClient
        .from('Places') // Tu tabla se llama Places
        .select('id, lat, lng, name');

    if (error) {
        console.error("Error al cargar desde Supabase:", error);
    } else {
        console.log("Marcadores cargados:", data);
        if (data) {
            data.forEach(punto => {
                // Dibujamos cada punto guardado en el mapa
                const marker = L.marker([punto.lat, punto.lng]).addTo(map)
                    .bindPopup(punto.name || 'Taller');
                marker.markerId = punto.id;
                marker.on('click', function() {
                    const currentName = this.getPopup().getContent();
                    const newName = prompt('Editar nombre del marcador:', currentName);
                    if (newName && newName !== currentName) {
                        this.setPopupContent(newName);
                        updateMarker(this.markerId, newName);
                    }
                });
            });
        }
    }
}

// 4. Función para GUARDAR un nuevo marcador en la base de datos
async function saveMarker(lat, lng) {
    console.log("Guardando en Supabase...", lat, lng);
    const { data, error } = await supabaseClient
        .from('Places')
        .insert([{ lat: lat, lng: lng, name: 'Taller' }])
        .select('id');

    if (error) {
        console.error("Error al insertar en la tabla:", error.message);
        alert("Error al guardar: " + error.message);
        return null;
    } else {
        console.log("¡Éxito! Guardado correctamente.", data);
        return data[0].id;
    }
}

// 5. Función para ACTUALIZAR el nombre de un marcador
async function updateMarker(id, name) {
    console.log("Actualizando marcador...", id, name);
    const { error } = await supabaseClient
        .from('Places')
        .update({ name: name })
        .eq('id', id);

    if (error) {
        console.error("Error al actualizar:", error.message);
        alert("Error al actualizar: " + error.message);
    } else {
        console.log("Nombre actualizado correctamente.");
    }
}

// 5. Evento: Al hacer clic en el mapa
map.on('click', function(e) {
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;

    // Colocamos el marcador visualmente de inmediato
    L.marker([lat, lng]).addTo(map)
        .bindPopup("Punto guardado")
        .openPopup();

    // Lo enviamos a Supabase para que sea permanente
    saveMarker(lat, lng);
});

// 6. Ejecución inicial
// Esto hace que los puntos aparezcan en cuanto abres la página
loadMarkers();