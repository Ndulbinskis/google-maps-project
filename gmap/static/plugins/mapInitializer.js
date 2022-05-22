async function initMap() {
  console.log("in initMap*********");
  // **************************
  // Map center location
  // **************************
  trafficLayer = new google.maps.TrafficLayer();

  var options = {
    zoom: 10,
    mapTypeControl: false,
    center: {
      lat: 51.5072,
      lng: -0.1276,
    },
  };

  map = new google.maps.Map(document.getElementById("map"), options);

  // **************************
  // Map styles selector
  // **************************
  locationOptionsArray = document.getElementsByClassName("location-option");
  for (let i = 0; i < locationOptionsArray.length; i++) {
    locationOptionsArray[i].addEventListener("click", function () {
      locations = {
        Plymouth: { lat: 50.3755, lng: -4.1427 },
        Plympton: { lat: 50.386, lng: -4.0359 },
        London: { lat: 51.5072, lng: -0.1276 },
      };
      var selectedLocation = locations[locationOptionsArray[i].innerHTML];
      map.panTo(selectedLocation);
    });
  }

  // **************************
  // Review status selector
  // **************************
  statusOptionsArray = document.getElementsByClassName("status-option");
  console.log(statusOptionsArray);
  for (let i = 0; i < statusOptionsArray.length; i++) {
    statusOptionsArray[i].addEventListener("click", function () {
      var statuses = {
        pending: "pending",
        reviewed: "reviewed",
        "in progress": "in-progress",
      };
      var selectedStatus = statuses[statusOptionsArray[i].innerHTML];
      console.log(
        statusOptionsArray[i],
        statusOptionsArray[i].innerHTML,
        selectedStatus
      );
      document.getElementById("route_status").value = selectedStatus;
      console.log(document.getElementById("route_status").value);
      // updateWayPointsForm();
    });
  }
  // Set the map's style to the initial value of the selector.
  // Apply new JSON when the user selects a different style.
  styleOptionsArray = document.getElementsByClassName("style-option");
  for (let i = 0; i < styleOptionsArray.length; i++) {
    styleOptionsArray[i].addEventListener("click", function () {
      values = {
        Default: "my",
        "Night mode": "night",
        Silver: "silver",
        Main: "retro",
        "Hide features": "hiding",
      };
      var selectedValue = values[styleOptionsArray[i].innerHTML];
      map.setOptions({ styles: styles[selectedValue] });
    });
  }
  // *************************
  // add marker on click
  // *************************
  google.maps.event.addListener(map, "click", function (event) {
    if (allowMapClick) {
      var details = { coords: event.latLng };
      addMarkerAndUpdateCamForm(details);
    }
    if (allowAddWayPoint) {
      var location = {
        location: {
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
          created_at: new Date().getTime(),
        },
      };
      wayPoints.push(location);
      setSpeedBetweenLast2AddedWaypoints();
      if (wayPoints.length >= 2) {
        calculateAndShowRoute();
        updateWayPointsStepper(wayPoints);
      }

      /////////////////////////////////
      suggestStreets(event.latLng.lat(), event.latLng.lng(), 0.1, map);
      /////////////////////////////////
    }
    allowMapClick = false;
  });

  function updateRmvCamForm(details) {
    document.getElementById("rmv_frm_lat").value =
      typeof details.coords.lat == "number"
        ? details.coords.lat
        : details.coords.lat();
    document.getElementById("rmv_frm_lng").value =
      typeof details.coords.lng == "number"
        ? details.coords.lng
        : details.coords.lng();
    document.getElementById("rmv_frm_addr").value = details.address;
    document.getElementById("rmv_frm_id").value = details.id;
  }
  function updateCamForm(details) {
    console.log(details, typeof details.coords.lat);
    document.getElementById("lat").value =
      typeof details.coords.lat == "number"
        ? details.coords.lat
        : details.coords.lat();
    document.getElementById("lng").value =
      typeof details.coords.lng == "number"
        ? details.coords.lng
        : details.coords.lng();
    document.getElementById("addr").value = details.address;
    document.getElementById("id").value = details.id;
  }
  function addMarkerAndUpdateCamForm(details) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: details.coords }).then((response) => {
      if (response.results[0]) {
        console.log(response.results);
        var address = response.results[0].formatted_address;
        details["address"] = address;
        var adr_prt = getAddressParts(response.results[0]);
        document.getElementById("area").value =
          "postal_town" in adr_prt && adr_prt.postal_town;
        document.getElementById("postcode").value =
          "postal_code" in adr_prt && adr_prt.postal_code;
        details.content = `<h3>${address}</h3> 
                  <a>Update New Cam Form</a> 
                  <br> <a>${
                    "postal_town" in adr_prt && adr_prt.postal_town
                  }</a> 
                  <br> <br> <a>${
                    "postal_code" in adr_prt && adr_prt.postal_code
                  }</a> 
                  <br> <a>${details.coords.lat()}</a> ,
                  <a>${details.coords.lng()}</a>`;
      }
      updateCamForm(details);
      addMarker(details);
    });
  }

  function getAddressParts(addr) {
    let address = {};
    const address_components = addr.address_components;
    address_components.forEach((element) => {
      address[element.types[0]] = element.short_name;
    });
    return address;
  }
  // **************************
  // Add a marker clusterer to manage the markers.
  // **************************
  // hardcoded marker

  //Add marker
  var hardCodedMarkers = [
    //Plymouth
    {
      coords: {
        lat: 50.402120610162903,
        lng: -4.186951004941442,
      },
      // iconImage: '',
      content:
        "<h1>644 Wolseley Rd, St Budeaux</h1>" +
        "<br>" +
        "<h2>Plymouth</h2>" +
        "<a>PL5 1TE</a>",
    },
  ];

  var markers = [...hardCodedMarkers, ...dbMarkers];

  // Loop through markers
  var gmarkers = [];
  for (var i = 0; i < markers.length; i++) {
    gmarkers.push(await addMarker(markers[i]));
  }
  // marker cluster
  new MarkerClusterer(map, gmarkers, {
    imagePath:
      "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
  });
  //Add Marker function
  async function addMarker(props) {
    var infoWindowContent;
    const image = "/static/components/camera_icon.png";
    marker = new google.maps.Marker({
      position: props.coords,
      map: map,
      icon: image,
    });
    markerToRemove = marker;

    //set content of marker
    if (props.content) {
      infoWindowContent = await generateInfoWindowContent(props);

      var infoWindow = new google.maps.InfoWindow({
        content: infoWindowContent,
      });
      // mouse click marker opens content
      marker.addListener("click", function () {
        infoWindow.open(map, this);
        // updateCamForm(props)
        updateRmvCamForm(props);
        markerToRemove = this;
      });
    }
    return marker;
  }

  // **************************
  // Add streets waypoints
  // **************************

  directionsStreetService = new google.maps.DirectionsService();
  directionsStreetRenderer = new google.maps.DirectionsRenderer({
    preserveViewport: true,
    draggable: true,
    alternatives: true,
    map: map,
    preserveViewport: true,
    polylineOptions: {
      strokeColor: "#FF0000",
      strokeOpacity: 0.1,
    },
    suppressPolylines: true,
    supressMarker: true,
    markerOptions: {
      icon: "/static/components/transparent_q_m.png",
    },
  });
  // **************************
  // Add waypoints
  // **************************
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer({
    draggable: true,
    alternatives: true,
    map,
    polylineOptions: {
      strokeColor: "#5D3FD3",
    },
    panel: document.getElementById("panel"),
  });

  directionsRenderer.addListener("directions_changed", () => {
    const directions = directionsRenderer.getDirections();
    if (directions) {
      computeTotalDistance(directions);
      setSpeedBetweenLast2AddedWaypoints();
    }
  });
  if (wayPoints.length >= 2) {
    showRoute(editRoute);
    updateWayPointsStepper(wayPoints);
  }
  // ***********************************************
  // add listener to traffic refresh interval option
  // ***********************************************
  refreshIntervalOptionsArray = document.getElementsByClassName(
    "refresh-interval-option"
  );

  for (let i = 0; i < refreshIntervalOptionsArray.length; i++) {
    refreshIntervalOptionsArray[i].addEventListener("click", function () {
      values = {
        "1 min": 60000,
        "5 min": 300000,
        "10 min": 600000,
      };
      trafficLayerRefreshTimeInterval =
        values[refreshIntervalOptionsArray[i].innerHTML];
    });
  }
}
