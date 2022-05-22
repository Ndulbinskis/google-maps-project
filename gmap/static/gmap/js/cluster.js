  function initMap() {
    // map options
    var options = {
      zoom: 12,
      center: {
        lat: 50.376289,
        lng: -4.143841
      }
    }
    var map = new google.maps.Map(document.getElementById('map'), options);
    // Add a marker clusterer to manage the markers.

    //Add marker
    var markers = [

      //Plymouth
      {
        coords: {
          lat: 50.40123994407854,
          lng: -4.185487122205781
        },
        iconImage: '',
        content: '<h1>Wolseley Rd, St Budeaux </h1>' + '<h3>Plymouth</h3>' + '<a>PL5 1TE</a>'
      },
      {
        coords: {
          lat: 50.402120610162903,
          lng: -4.186951004941442
        },
        iconImage: '',
        content: '<h1>644 Wolseley Rd, St Budeaux</h1>' + '<br>' + '<h2>Plymouth</h2>' + '<a>PL5 1TE</a>'
      },
      {
        coords: {
          lat: 50.4003292396132,
          lng: -4.13502489209052
        },
        iconImage: '', ////////////////////add picture
        content: '<h1>Roundabout</h1>' + '<br>' + '<h2>Plymouth</h2>' + '<a>PL3 5RL</a>'
      },
      {
        coords: {
          lat: 50.371564233718523,
          lng: -4.138840430911934
        },
        iconImage: '',
        content: '<h1>12-16 Old Town St,</h1>' + '<br>' + '<h2>Plymouth</h2>' + '<a>PL1 1DG</a>'
      },
      {
        coords: {
          lat: 50.370000223883402,
          lng: -4.148633233388321
        },
        iconImage: '',
        content: '<h1>Stonehouse</h1>' + '<br>' + '<h2>Plymouth</h2>' + '<a> </a>'
      },
      {
        coords: {
          lat: 50.37597336466289,
          lng: -4.142211044596955
        },
        iconImage: '',
        content: '<h1>University of Plymouth,</h1>' + '<br>' + '<h2>Plymouth</h2>' + '<a>PL4 6DX</a>'
      },

      {
        coords: {
          lat: 50.418275817628817,
          lng: -4.122013474378949
        },
        iconImage: '',
        content: '<h1>A386, </h1>' + '<br>' + '<h2>Plymouth </h2>' + '<a>PL6 8BB</a>'
      },
      {
        coords: {
          lat: 50.406766671612637,
          lng: -4.133693214844235
        },
        iconImage: '',
        content: '<h1>8 Morshead Rd, </h1>' + '<br>' + '<h2>Plymouth </h2>' + '<a>PL6 5AJ</a>'
      },
      {
        coords: {
          lat: 50.414011625944752,
          lng: -4.126751602234512
        },
        iconImage: '',
        content: '<h1>William Prance Rd, </h1>' + '<br>' + '<h2>Plymouth </h2>' + '<a>PL6 5DA</a>'
      },
      {
        coords: {
          lat: 50.400227594675719,
          lng:  -4.136651428424221
        },
        iconImage: '', //add picture!!!!!!!!!!!!!!!
        content: '<h1> </h1>' + '<br>' + '<h2>Plymouth </h2>' + '<a>PL2 3SU</a>'
      },
      {
        coords: {
          lat: 50.372083990706152,
          lng: -4.146045301634397
        },
        iconImage: '',
        content: '<h1>Cornwall St, </h1>' + '<br>' + '<h2>Plymouth </h2>' + '<a>PL1 1PA</a>'
      },
      {
        coords: {
          lat: 53.018,
          lng: -6.398
        },
        iconImage: '',
        content: '<h1> Wicklow Mountains National Park</h1>' + '<br>' + '<h2>Learn More</h2>' + '<a>https://www.wicklowmountainsnationalpark.ie/</a>'
      },
      {
        coords: {
          lat: 53.011299,
          lng: -6.326156
        },
        iconImage: '',
        content: '<h1> Glendalough </h1>' + '<br>' + '<h2>Learn More</h2>' + '<a>http://www.glendalough.ie/</a>'
      },
      {
        coords: {
          lat: 53.1876492494,
          lng: -6.083832998
        },
        iconImage: '',
        content: '<h1> Bray</h1>' + '<br>' + '<h2>Learn More</h2>' + '<a>http://www.bray.ie/</a>'
      },
      {
        coords: {
          lat: 53.144,
          lng: -6.072
        },
        iconImage: '',
        content: '<h1>Greystones</h1>' + '<br>' + '<h2>Learn More</h2>' + '<a>http://visitwicklow.ie/item/greystones/</a>'
      },
      {
        coords: {
          lat: 52.518664592,
          lng: -7.887329784
        },
        iconImage: '',
        content: '<h1>Rock of Cashel</h1>' + '<br>' + '<h2>Learn More</h2>' + '<a>https://www.cashel.ie/</a>'
      },
      {
        coords: {
          lat: 52.6477,
          lng: -7.2561
        },
        iconImage: '',
        content: '<h1>Killenny</h1>' + '<br>' + '<h2>Learn More</h2>' + '<a>https://visitkilkenny.ie/</a>'
      },
      //cork
      {
        coords: {
          lat: 51.902694,
          lng: -8.4767
        },
        iconImage: '',
        content: '<h1>Museum of Butter</h1>' + '<br>' + '<h2>Learn More</h2>' + '<a>http://thebuttermuseum.com/</a>'
      },
      {
        coords: {
          lat: 51.89953,
          lng: -8.499022
        },
        iconImage: '',
        content: '<h1>Cork City Gaol</h1>' + '<br>' + '<h2>Learn More</h2>' + '<a>https://corkcitygaol.com/</a>'
      },

      {
        coords: {
          lat: 53.4513204,
          lng: -6.140871
        },
        iconImage: '',
        content: '<h1>Malahide</h1>' + '<br>' + '<h2>Learn More</h2>' + '<a>https://www.malahide.ie/</a>'
      },

      {
        coords: {
          lat: 53.2839577,
          lng: -9.0837658
        },
        iconImage: '',
        content: '<h1>Galway</h1>' + '<br>' + '<h2>Learn More</h2>' + '<a>https://www.galwaytourism.ie/</a>'
      },
      {
        coords: {
          lat: 53.470580,
          lng: -6.122405
        },
        iconImage: '',
        content: '<h1>Donabate Beach</h1>' + '<br>' + '<h2>Learn More</h2>' + '<a>https://en.wikipedia.org/wiki/Donabate</a>'
      },
      {
        coords: {
          lat: 52.9713299,
          lng: -9.4300415
        },
        iconImage: '',
        content: '<h1>Donabate Beach</h1>' + '<br>' + '<h2>Learn More</h2>' + '<a>https://www.cliffsofmoher.ie/</a>'
      },
      {
        coords: {
          lat: 51.8960528,
          lng: -8.4980693
        },
        iconImage: '',
        content: '<h1>Cork</h1>' + '<br>' + '<h2>Learn More</h2>' + '<a>https://purecork.ie/</a>'
      },
      {
        coords: {
          lat: 53.3667776,
          lng: -6.5064198
        },
        iconImage: '',
        content: '<h1>Leixlip</h1>' + '<br>' + '<h2>Learn More</h2>' + '<a>https://pl.wikipedia.org/wiki/Leixlip</a>'
      },
      {
        coords: {
          lat: 53.1654628,
          lng: -6.125499
        },
        iconImage: '',
        content: '<h1>Little Sugar Loaf</h1>' + '<br>' + '<h2>Learn More</h2>' + '<a>https://www.greystonesguide.ie/little-sugar-loafs-big-day/</a>'
      },
      {
        coords: {
          lat: 53.5474019,
          lng: -6.0933048
        },
        iconImage: '',
        content: '<h1>Rockabill View</h1>' + '<br>' + '<h2>Learn More</h2>' + '<a>http://www.skerriesseatours.ie/trips.html</a>'
      },
      {
        coords: {
          lat: 52.3337499,
          lng: -6.4906996
        },
        iconImage: '',
        content: '<h1>Wexford</h1>' + '<br>' + '<h2>Learn More</h2>' + '<a>https://www.visitwexford.ie/</a>'
      },
    ];

    // Loop through markers
    var gmarkers = [];
    for (var i = 0; i < markers.length; i++) {
      console.log(markers[i]);
      gmarkers.push(addMarker(markers[i]));

    }

    //Add MArker function
    function addMarker(props) {
      var marker = new google.maps.Marker({
        position: props.coords,
        map: map,

      });

      /* if(props.iconImage){
        marker.setIcon(props.iconImage);
      } */

      //Check content
      if (props.content) {
        var infoWindow = new google.maps.InfoWindow({
          content: props.content
        });
        marker.addListener('click', function() {
          infoWindow.open(map, marker);
        });
      }
      return marker;
    }
    var markerCluster = new MarkerClusterer(map, gmarkers, {
      imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
    });
  }
  google.maps.event.addDomListener(window, 'load', initMap)