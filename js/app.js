// Data for the markers to be listed by name, LatLng, and zIndex.
var favorites = [
  {
    'title': 'Safeco Field',
    'lat': 47.5916418,
    'lng': -122.3354621,
    'zIndex': 1,
    'info': 'Safeco Field'
  },
  {
    'title': 'The Crumpet Shop',
    'lat': 47.6090057,
    'lng': -122.3403555,
    'zIndex': 2,
    'info': 'The Crumpet Shop'
  },
  {
    'title': 'Seattle Art Museum',
    'lat': 47.606646,
    'lng': -122.3395729,
    'zIndex': 3,
    'info': 'Seattle Art Museum'
  },
  {
    'title': 'Showbox SoDo',
    'lat': 47.5874092,
    'lng': -122.3344886,
    'zIndex': 4,
    'info': 'Showbox SoDo'
  },
  {
    'title': 'GameWorks',
    'lat': 47.611404,
    'lng': -122.3354338,
    'zIndex': 5,
    'info': 'GameWorks'
  }
];

var map;
var markers = [];

// Creates custom Google Maps map.
var initMap = function () {
  var myLatLng = {lat: 47.6010942, lng: -122.3359881};

  // Create a map object and specify the DOM element for display.
  map = new google.maps.Map(document.getElementById('map'), {
    center: myLatLng,
    scrollwheel: false,
    zoom: 14
  });

  setMarkers(map, favorites);
}

// Adds markers to the map.
var setMarkers = function (map, favList) {
  for (var i = 0; i < favList.length; i++) {
    favList[i].zIndex = i;

    var fav = favList[i];

    var marker = new google.maps.Marker({
      position: {lat: fav.lat, lng: fav.lng},
      map: map,
      title: fav.title,
      zIndex: i
    });

    var info = new google.maps.InfoWindow({
      content: fav.info
    });

    markerExtras(map, marker, info);

    markers.push(marker);
  }
}

// Adds animation and info to a marker.
var markerExtras = function (map, marker, info) {
  marker.addListener('click', function () {
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function() {
      marker.setAnimation(null);
    }, 1400);
  });

  marker.addListener('click', function() {
    info.open(map, marker);
  });

}

// Sets the map on all markers in the array.
function setMapOnAll (map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers () {
  setMapOnAll(null);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers () {
  clearMarkers();
  markers = [];
}

// Triggers animation and info window for marker.
function toggleBounce (map, mark) {
  google.maps.event.trigger(mark, 'click');
}

var ViewModel = function () {
  var self = this;

  self.favList = ko.observableArray([]);
  self.searchLocation = ko.observable('');

  // Populate observable array from favorites.
  favorites.forEach(function (favInfo) {
    self.favList.push(favInfo);
  })

  // Adds Yelp info and Displays info when list name or marker is clicked on.


  // Triggers animation and info window for marker when name of marker is clicked on
  self.bounce = function (mark) {
    toggleBounce(map, markers[mark.zIndex]);
  }

  // Filters list and markers based on user input in the search bar.
  self.searchLocation.subscribe(function (loc) {

    // Runs code if the search bar is not blank.
    if (loc !== '') {
      var locLength = loc.length;

      // Clears observable array.
      self.favList.removeAll();

      // Runs through each object in favorites to compare to user input.
      favorites.forEach(function (favInfo) {
        var favTitle = favInfo.title;

        // Runs through each letter in the location name.
        for (var i = 0; i < favTitle.length; i++) {
          var fav = '';

          // Adds on additional letters to match the user input string length.
          for (var j = 0; j < locLength; j++) {
            fav = fav + favTitle[i+j];
          }

          // Runs if the location name's string matches the user input's string.
          if (fav.toLowerCase() == loc.toLowerCase()) {
            // Adds location name to array and exits the loop for said location name.
            self.favList.push(favInfo);
            return
          }
        }
      })

      // Clears markers from google maps and adds the new arrays.
      deleteMarkers();
      setMarkers(map, self.favList());

    }else {
      // Clears observable array and then populates it with all of favorites' objects.
      self.favList.removeAll();

      favorites.forEach(function (favInfo) {
        self.favList.push(favInfo);
      })

      // Clears markers from google maps and adds the new arrays.
      deleteMarkers();
      setMarkers(map, self.favList());
    }

  })

}

ko.applyBindings( new ViewModel() );
