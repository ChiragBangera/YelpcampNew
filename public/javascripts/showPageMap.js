mapboxgl.accessToken = mapToken
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v10', // style URL
    center: geometry.geometry.coordinates, // starting position [lng, lat]
    zoom: 9, // starting zoom
    projection: 'globe' // display the map as a 3D globe
});

new mapboxgl.Marker()
    .setLngLat(geometry.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset:15})
        .setHTML(
            `<h5>${geometry.title}</h5>`
        )
    )
    .addTo(map)

map.on('style.load', () => {
    map.setFog({}); // Set the default atmosphere style
});

