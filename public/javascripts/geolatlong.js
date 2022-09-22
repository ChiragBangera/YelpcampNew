const longitute = document.getElementById('longitude');
const latitude = document.getElementById('latitude');



const map = new maplibregl.Map({
    container: 'map',
    style:'https://api.maptiler.com/maps/streets/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL',
    center: [74.8560,12.9141],
    zoom: 10
});

var marker = new maplibregl.Marker({
    draggable: true
})
    .setLngLat([74.8560,12.9141])
    .addTo(map);

function onDragEnd() {
    const lngLat = marker.getLngLat();
    longitute.value = lngLat.lng
    latitude.value = lngLat.lat
}

marker.on('dragend', onDragEnd);