mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: campgroundmap.geometry.coordinates,
    zoom: 12
});

const marker1 = new mapboxgl.Marker()
    .setLngLat(campgroundmap.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(`<h4> ${campgroundmap.title} </h4> <p> ${campgroundmap.location} </p>`)
    )
    .addTo(map);

map.addControl(new mapboxgl.NavigationControl());
