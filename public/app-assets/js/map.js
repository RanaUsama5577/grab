// Code goes here

$(document).ready(function () {
    var map = null;
    var myMarker;
    var myLatlng;

    function initializeGMap(lat, lng) {
        myLatlng = new google.maps.LatLng(lat, lng);

        var myOptions = {
            zoom: 12,
            zoomControl: true,
            center: myLatlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

        myMarker = new google.maps.Marker({
            position: myLatlng
        });
        myMarker.setMap(map);
    }

    // Re-init map before show modal
    $('#mapModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget);
        initializeGMap(button.data('lat'), button.data('lng'));
        $("#location-map").css("width", "100%");
        $("#map_canvas").css("width", "100%");
    });

    // Trigger map resize event after modal shown
    $('#mapModal').on('shown.bs.modal', function () {
        google.maps.event.trigger(map, "resize");
        map.setCenter(myLatlng);
    });
});
var marker;
var map;
var radius = 10000;
var geocoder;
function initMap(latitude,longitude) {
    search_lat = "";
    search_lng = "";
    formattedAddress = "";
    latitude = parseFloat(latitude) ?? -33.878358;
    longitude = parseFloat(longitude) ?? 151.1835443;
    var input = document.getElementById('autocomplete_search');
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 11,
        center: { lat: latitude, lng: longitude }
    });
    // var geoloccontrol = new klokantech.GeolocationControl(map, 11);
    marker = new google.maps.Marker({
        map: map,
        draggable: true,
        zoom: 11,
        animation: google.maps.Animation.DROP,
        position: { lat: latitude, lng: longitude }
    });
    marker.addListener('click', toggleBounce);
    markerCoords(marker);
    geocoder = new google.maps.Geocoder();
    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.addListener('place_changed', function () {
        var place = autocomplete.getPlace();
        // place variable will have all the information you are looking for.
        $('#lat').val(place.geometry['location'].lat());
        $('#long').val(place.geometry['location'].lng());
        search_lat = place.geometry['location'].lat();
        search_lng = place.geometry['location'].lng();
        $("#address").html(place.formatted_address);
        $("#autocomplete_search").val(place.formatted_address);

        //setCountryStateCity(place, false);
        // SETTING LAT LNG
        $("#lat").val(search_lat);
        $("#lng").val(search_lng);
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 18,
            center: { lat: search_lat, lng: search_lng }
        });
        marker = new google.maps.Marker({
            map: map,
            draggable: true,
            zoom: 18,
            animation: google.maps.Animation.DROP,
            position: { lat: search_lat, lng: search_lng }
        });
        marker.addListener('click', toggleBounce);
        markerCoords(marker);
        var latlng = new google.maps.LatLng(search_lat, search_lng);
        map.setCenter(latlng);
        console.log('init Map', search_lat);
    });
}
function toggleBounce() {
    if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
    } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
    }
}
function markerCoords(markerobject) {
    google.maps.event.addListener(markerobject, 'dragend', function (evt) {
        var newlat = evt.latLng.lat().toFixed(3);
        var newlng = evt.latLng.lng().toFixed(3);
        geocoder.geocode({
            latLng: new google.maps.LatLng(newlat, newlng)
        }, function (responses) {
            if (responses && responses.length > 0) {
                //setCountryStateCity(responses, true);
                $("#address").html(responses[0].formatted_address);
                $("#autocomplete_search").val(responses[0].formatted_address);
            }
            else {
                console.log('Cannot determine address at this location.');
            }
        });
        $("#lat").val(newlat);
        $("#lng").val(newlng);
        console.log(newlat, " drag value");

    });
}
$("#MyLocator").on("click", function () {
    getLocation();
})
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        var latitude = "-33.878358";
        var longitude = "151.1835443";
        $("#lat").val("-33.878358");
        $("#lng").val("151.1835443");
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 18,
            center: { lat: latitude, lng: longitude }
        });
        marker = new google.maps.Marker({
            map: map,
            draggable: true,
            zoom: 2,
            animation: google.maps.Animation.DROP,
            position: { lat: latitude, lng: longitude }
        });
        marker.addListener('click', toggleBounce);
        //radius = 1000;
        markerCoords(marker);
        var latlng = new google.maps.LatLng(latitude, longitude);
        map.setCenter(latlng);
        $("#autocomplete_search").val(map.formatted_address);
        alert("Geolocation is not supported by this browser.");
    }
}
function showPosition(position) {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 18,
        center: { lat: position.coords.latitude, lng: position.coords.longitude }
    });
    marker = new google.maps.Marker({
        map: map,
        draggable: true,
        zoom: 2,
        animation: google.maps.Animation.DROP,
        position: { lat: position.coords.latitude, lng: position.coords.longitude }
    });
    marker.addListener('click', toggleBounce);
    markerCoords(marker);
    var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    map.setCenter(latlng);
    $("#lat").val(position.coords.latitude);
    $("#lng").val(position.coords.longitude);
    console.log("Show position ", position.coords.latitude);
}