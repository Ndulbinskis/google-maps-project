const waypointMarks = {
  1: "A",
  2: "B",
  3: "C",
  4: "D",
  5: "E",
  6: "F",
  7: "G",
  8: "H",
  9: "I",
  10: "J",
  11: "K",
  12: "L",
  13: "M",
  14: "N",
  15: "O",
  16: "P",
  17: "Q",
  18: "R",
  19: "S",
  20: "T",
  21: "U",
  22: "V",
  23: "W",
  24: "X",
  25: "Y",
  26: "Z",
};
var distanceBetweenLast2WayPoints;
function restoreLastWayPoint() { console.log("in restore last waypoint")
  if (popedWayPoints.length >= 1) {
    popedWayPoint = popedWayPoints.pop();
    wayPoints.push(popedWayPoint);
    calculateAndShowRoute();
    updateWayPointsStepper(wayPoints);
    if (current_user_group != "reviewer") updateWayPointsForm();
  }
}
function removeLastWayPoint() {
  var popedWayPoint;
  if (wayPoints.length > 2) {
    popedWayPoint = wayPoints.pop();
    popedWayPoints.push(popedWayPoint);
    calculateAndShowRoute();
    updateWayPointsStepper(wayPoints);
    if (current_user_group != "reviewer") updateWayPointsForm();
  }
  return popedWayPoint;
}
function updateWayPointsForm() {
  document.getElementById("wayPoints").value = JSON.stringify(wayPoints);
}
function updateWayPointsStepper(wayPoints) {
  var step;
  var steps = "";
  for (let p in wayPoints) {
    step = `<div class="step" data-target="#logins-part">
               <div style="font-size:12px;width:90px;" type="button" class="step-trigger" role="tab" aria-controls="logins-part" id="logins-part-trigger">
                  <p class="bs-stepper-circle">${
                    waypointMarks[parseInt(p) + 1]
                  }</p>
                 
                  <p class="bs-stepper-label">${new Date(
                    wayPoints[p].location.created_at * 1000
                  )
                    .toLocaleString("de")
                    .replaceAll(",", " <br> ")}</p>
                
                </div>
            </div>
            <div class="line"></div>`;
    steps += step;
  }
  document.getElementById("waypoints-steps").innerHTML = steps;
}
function computeTotalDistance(result) {
  let total = 0;
  const myroute = result.routes[0];

  if (!myroute) {
    return;
  }

  for (let i = 0; i < myroute.legs.length; i++) {
    total += myroute.legs[i].distance.value;
    distanceBetweenLast2WayPoints = myroute.legs[i].distance.value;
  }

  total = total / 1000;
  document.getElementById("total").innerHTML = total + " km";
}
function calculateAndShowRoute() {
  updateWayPointsForm();
  displayRoute(
    wayPoints[0],
    wayPoints[wayPoints.length - 1],
    directionsService,
    directionsRenderer
  );
}
async function showRoute(editRoute) {

  allowAddWayPoint = true;
  console.log("showRoute editRoute:", editRoute);
  document.getElementById("exit_training_mode").style.display = "block";
  document.getElementById("remove_last_waypoint").style.display = "block";
  document.getElementById("show_traffic_layer").style.display = "block";

  document.getElementById("timeline").style.display = "block";
  document.getElementById("timeline").style.height = "95vh";
  document.getElementById("map").style.width = "66.8vw";
  if (current_user_group != "reviewer") {
    document.getElementById("add-cam").style.display = "none";
    document.getElementById("rmv-cam").style.display = "none";
  }
  if (wayPoints.length >= 2) {
    displayRoute(
      wayPoints[0],
      wayPoints[wayPoints.length - 1],
      directionsService,
      directionsRenderer
    );
    if (!editRoute) {
      document.getElementById("route_name").disabled = true;
      document.getElementById("save_case").style.display = "none";
      document
        .getElementById("status-dropdown-menu-items")
        .parentNode.removeChild(
          document.getElementById("status-dropdown-menu-items")
        );
      document.getElementsByClassName("fa-redo")[0].style.marginRight = "115px";
    }
    document.getElementsByClassName("stepper")[0].style.display = "block";
    document.getElementById("map").style.height = "75vh";
    document.getElementById("timeline").style.height = "75vh";
    document.getElementById("show_traffic_layer").style.margin =
      "60.5vh 0.85vw";
  }
}
function displayRoute(origin, destination, service, display) {
  service
    .route({
      origin: origin,
      destination: destination,
      waypoints: wayPoints.slice(1, wayPoints.length - 1),
      travelMode: google.maps.TravelMode.DRIVING,
      avoidTolls: true,

    })
    .then((result) => {
      display.setDirections(result);
    })
    .catch((e) => {
      alert("Could not display directions due to: " + e);
    });
}

function getStreets(lat, lng, r) {
  return fetch(
    `http://api.geonames.org/findNearbyStreetsOSMJSON?lat=${lat}&lng=${lng}&radius=${r}&username=forensics`
  ).then((r) => r.json());
}

function showStreet(streetsIntermediatePoint, color) {
  directionsStreetService
    .route({
      origin: wayPoints[wayPoints.length - 1],
      destination:
        streetsIntermediatePoint[streetsIntermediatePoint.length - 1],
      travelMode: google.maps.TravelMode.DRIVING,
    })
    .then((routeFromWayPointToLastStreet) => {
      showSuggestedStreet(
        routeFromWayPointToLastStreet,
        streetsIntermediatePoint,
        map,
        color
      );
    })
    .catch((e) => {
      alert("Could not display directions due to: " + e);
    });
}
function getStreetIntermediateWayPoint(streetWayPoints) {
  var streetWayPoint;
  if (streetWayPoints.length > 2) {
    streetWayPoint = streetWayPoints[Math.floor(streetWayPoints.length / 2)];
  } else {
    streetWayPoint = streetWayPoints[1];
  }
  [lng, lat] = streetWayPoint.split(" ");
  return {
    location: {
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      created_at: new Date().getTime(),
    },
  };
}
function showSuggestedStreet(
  routeFromWayPointToLastStreet,
  streetsIntermediatePoint,
  map,
  color
) {
  // For each step, place a marker, and add the text to the marker's infowindow.
  // Also attach the marker to an array so we can keep track of it and remove it
  // when calculating new routes.

  saveWaypointToStreetsSteps(routeFromWayPointToLastStreet.routes, color);
  for (var streetIntermediatePoint of streetsIntermediatePoint) {
    const street_question_mark = new google.maps.Marker({
      icon: "/static/components/transparent_q_m.png",
    });
    suggested_streets_markers.push(street_question_mark);
    street_question_mark.setMap(map);
    street_question_mark.setPosition(streetIntermediatePoint.location);
    const infoWindow = new google.maps.InfoWindow();
    attachInstructionText(
      infoWindow,
      street_question_mark,
      streetIntermediatePoint.location
    );
  }
}
async function saveWaypointToStreetsSteps(routes, color) {
  //send the steps between waypoint and each street to be written in the KML file
  const formData = new FormData();

  formData.append("data", generateKLMContent(routes, color));
  await fetch("/dashboard/route/save-steps-to-kml", {
    method: "POST",
    body: formData,
  });
}
function attachInstructionText(
  infoWindow,
  marker,
  location = { lat: "", lng: "" }
) {
  google.maps.event.addListener(marker, "click", () => {
    // Open an info window when the marker is clicked on, containing the text
    // of the step.
    infoWindow.open(map, marker);
    infoWindow.setContent(
      `<div>${location.lat}-${
        location.lng
      }
<br>
<br>
<button class="btn btn-outline-primary btn-sm" onclick="confirmWayPoint(${marker.position.lat()},${marker.position.lng()})">Confirm</button>
<button class="btn btn-outline-dark btn-sm" onclick="closeWayPointInfoWindow(this)">Decline</button></div>`
    );
  });
}
function confirmWayPoint(lat, lng) {
  var location = {
    location: {
      lat: lat,
      lng: lng,
      created_at: new Date().getTime(),
      speed: 0,
    },
  };
  wayPoints.push(location);
  setSpeedBetweenLast2AddedWaypoints();
  calculateAndShowRoute();
  for (var street_marker of suggested_streets_markers) {
    street_marker.setMap(null);

  }

  suggestStreets(lat, lng, 0.1, map);
}
function closeWayPointInfoWindow(infoWindow) {
  infoWindow.parentElement.parentElement.parentElement.parentElement.style.display =
    "none";
}

const timer = (ms) => new Promise((res) => setTimeout(res, ms));

function suggestStreets(lat, lng, r) {
  var streetLocation;
  var streetsIntermediatePoint = [];
  var streetWayPoints = [];
  resetKMLfile();
  getStreets(lat, lng, r).then(async (streetSegments) => {
    var i = 0;
    var streetsNames = [];
    var lastWayPoint = wayPoints[wayPoints.length - 1];
    lastWayPointStreetNameArr.push(streetSegments.streetSegment[0].name);
    var lastWayPointStreetName =
      lastWayPointStreetNameArr.length >= 2
        ? lastWayPointStreetNameArr[lastWayPointStreetNameArr.length - 1]
        : "";
    var inHurry = lastWayPoint.location.speed > 16;
    setSpeedBetweenLast2AddedWaypoints();
    for (street of streetSegments.streetSegment) {
      streetWayPoints = street.line.split(",");
      streetLocation = getStreetIntermediateWayPoint(streetWayPoints);

      if (!streetsNames.includes(street.name)) {
        if (lastWayPointStreetName == street.name && inHurry) {
          //<=== condition in case of high speed don't suggest the street where the suspect come from

          continue;
        }
        streetsNames.push(street.name);
        streetsIntermediatePoint.push(streetLocation);
        showStreet(streetsIntermediatePoint, getRouteColor(i));
        i++;
        await timer(1000);
        readKMLFile();
      }
    }
  });
}
async function resetKMLfile() {
  await fetch("/dashboard/route/reset-kml");
}
function readKMLFile() {
  //write into the CTA file the coordiantes between last waypoint and each suggested street
  if (geoXML3Parser) geoXML3Parser.hideDocument();
  geoXML3Parser = new geoXML3.parser({ map: map });
  geoXML3Parser.parse("/static/components/cta.kml");
}
function getRouteColor(i) {
  var colors = ["redLine", "greenLine", "yellowLine", "greyLine"];
  var ii = i > 3 ? i % 3 : i;
  return colors[ii];
}
function generateKLMContent(routes, color) {
  var lat1 = wayPoints[wayPoints.length - 1].location.lat,
    lng1 = wayPoints[wayPoints.length - 1].location.lng,
    template;

  var content = "";
  for (var i = 0; i < routes.length; i++) {
    // ${lng1},${lat1},0
    template = `
      <Placemark>
        <styleUrl>#${color}</styleUrl>
        <LineString>
          <altitudeMode>relative</altitudeMode>
          <coordinates>
           ${lng1},${lat1},0
            ${getRouteStepsCoordinates(routes[i])}
          </coordinates>
        </LineString>
      </Placemark>`;
    content += template;
  }
  return content;
}
function getRouteStepsCoordinates(route) {
  var coordiantes = "";
  for (step of route.legs[0].steps) {
    for (lat_lng of step.lat_lngs) {
      coordiantes += ` ${lat_lng.lng()}, ${lat_lng.lat()}, 0 `;
    }
  }
  return coordiantes;
}

function toggleTrafficLayer() {
  var layer = document.getElementById("show_traffic_layer").innerHTML;

  if (layer == "Traffic") {
    document.getElementById("show_traffic_layer").innerHTML = "Map";
    document.getElementById("traffic_layer_setter").style.display = "flex";
    document.getElementById("traffic_layer_setter").style.flexDirection = "row";

    trafficLayer.setMap(map);
    refreshInterval = setInterval(
      refreshTrafficLayer,
      trafficLayerRefreshTimeInterval
    );
  } else {
    document.getElementById("show_traffic_layer").innerHTML = "Traffic";
    document.getElementById("traffic_layer_setter").style.display = "none";
    clearInterval(refreshInterval);
    trafficLayer.setMap(null);
  }
}

function refreshTrafficLayer() {
  trafficLayer.setMap(null);
  trafficLayer.setMap(map);
}

function setSpeedBetweenLast2AddedWaypoints() {
  if (wayPoints.length < 2) {
    wayPoints[0].location.speed = 0;
    return 0;
  }
  var lastWayPoint = wayPoints[wayPoints.length - 1] || {
    location: { created_at: "" },
  };
  var beforeLastWayPoint = wayPoints[wayPoints.length - 2] || {
    location: { created_at: "" },
  };
  var timeElapsedBetweenTheCreationOfTheLast2WaypointsInSec =
    (lastWayPoint.location.created_at -
      beforeLastWayPoint.location.created_at) /
    1000;
  var speed =
    distanceBetweenLast2WayPoints /
    timeElapsedBetweenTheCreationOfTheLast2WaypointsInSec;
  lastWayPoint.location.speed = parseInt(speed);

  return speed;
}
