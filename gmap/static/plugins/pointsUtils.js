function getDbMarkers(dbPoints) {
  var dbMarkers = [];
  for (point of dbPoints) {
    // console.log(point);
    var content = `<h3>${point.street}</h3> <br> <a>${point.area}</a> <br> <br> <a>${point.postcode}</a> <br> <a>${point.latitude}</a> , <a>${point.longitude}</a>`;

    var marker = {
      // from hardcoded values code
      coords: {
        lat: point.latitude,
        lng: point.longitude,
      },
      content: content,
      address: point.street,
      id: point.id,
    };
    dbMarkers.push(marker);
  }
  return dbMarkers;
}
function removeMarker(e) {
  event.preventDefault();
  document.getElementById("lat").value = "";
  document.getElementById("lng").value = "";
  document.getElementById("addr").value = "";
  markerToRemove.setMap(null);
}

function closeInfoWindow(infoWindow) {
  infoWindow.parentElement.parentElement.parentElement.parentElement.style.display =
    "none";
}
function infoWindowConfirm(lat, lng) {
  confirmWayPoint(lat, lng);
}
async function getCamVideoUrl(lat, lng) {
  console.log(lat,"---",lng)
  // api.tfl.gov.uk/Place/JamCam/At/51.4966/-0.14156
  // https://api.tfl.gov.uk//Place/JamCams_00001.06507
  var videoUrl = "";
  //https://api.tfl.gov.uk/Place?lat=51.49659432845972&lon=-0.14140605926513672&radius=100&type=JamCam

  let data = await fetch(
    `https://api.tfl.gov.uk/Place?lat=${lat}&lon=${lng}&radius=100&type=JamCam`
  )
    .then((r) => r.json())
    .then((r) => {
      // console.log("r==>", r);
      if (r.places.length > 0) {
        videoUrl = r.places[0].additionalProperties[2].value;
        // console.log("videoUrl===>", videoUrl);
        return videoUrl;
      }
      return "";
    });
  return data;
}
async function generateInfoWindowContent(props) {
  var infoWindowContent = "";
  //set content of marker

  var videoUrl = await getCamVideoUrl(props.coords.lat, props.coords.lng);
  console.log(videoUrl);
  // style='margin-bottom:20px;' width="200" height="200"
  var videoDiv = videoUrl
    ? `<video height="200" width="400" loop="true" preload="none" controls autoplay muted>
        <source src=${videoUrl} type="video/mp4">
        Your browser does not support HTML video.
      </video>`
    : "";
  var wayPointActionButtonsDiv = allowAddWayPoint
    ? ` <div style="display:flex;flex-direction:row;margin-left:50px;justify-content:space-around">
          <button class="btn btn-primary" onclick="infoWindowConfirm(${props.coords.lat} , ${props.coords.lng})">confirm</button>
          <button class="btn btn-secondary" onclick="closeInfoWindow(this)">decline</button>
        </div>`
    : "";
  infoWindowContent = `
      <div class="card" style="padding:15px;background:lightgrey;" onmouseleave="closeInfoWindow(this)"> 
        <div class="card-img-top" style="justify-content:center;display:flex;">
          ${videoDiv}
        </div>
        <div class="card-body">
          <div class="card-text" style="margin-bottom:10px;">
            ${props.content}
          </div>
            ${wayPointActionButtonsDiv}
        </div>
      </div>`;

  return infoWindowContent;
}
