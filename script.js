var Esri_WorldStreetMap = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
  {
    attribution: "Tiles &copy; Esri",
  }
);
//
var Esri_WorldImagery = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {
    attribution: "Tiles &copy; Esri",
  }
);

var map = L.map("map", {
  center: [51.512547,-0.1383914],
  zoom: 11,
  layers: [Esri_WorldStreetMap],
});

var baseMaps = {
  "Road Map": Esri_WorldStreetMap,
  Satellite: Esri_WorldImagery,
};

const styleLine = {
	color: "#b33f62",
	weight: 5,
	opacity: 0.8,
	dashArray: '5, 10',
}

var layerControl = L.control.layers(baseMaps).addTo(map);

var trafalgar = L.latLng(51.50772778486903, -0.12789334630232424);
var orbit = L.latLng(51.5384259427927, -0.012888306990786986);
var bridge = L.latLng(51.50544301569967, -0.07542087642050452);
var museum = L.latLng(51.5193465398292, -0.12699415088683697);
var globe = L.latLng(51.508090530069445, -0.09711654272837142);
var eye = L.latLng(51.50328099536753, -0.11924479278678347);
var shard = L.latLng(51.50450815827801, -0.08642285994422501);
var palace = L.latLng(51.501126907043435, -0.1422869669152859);
var albert = L.latLng(51.50115925146817, -0.17734454232890345);
var wembley = L.latLng(51.55602136467789, -0.27940312328903466);
var market = L.latLng(51.512829252343245, -0.08347976995501874);
var nhm = L.latLng(51.49635428609559, -0.17634574573665013);
var pic = L.latLng(51.50990389384594, -0.1344474796694615);
var power = L.latLng(51.48173967647776, -0.1444907);
var dome = L.latLng(51.50294450213421, 0.003368876710965331);


const station = document.getElementById("station");
const myDiv = document.getElementById("my-div");

const userMarkers = []; // Array to store user-added markers

const nextButton = document.createElement("subbutton");
nextButton.innerText = "Next";
nextButton.id = "buttonsdiv";
nextButton.disabled = true;
nextButton.className = "my-button";

const submitButton = document.createElement("subbutton");
submitButton.innerText = "Enter";
submitButton.id = "buttonsdiv";
submitButton.disabled = true;
submitButton.className = "my-button";

let totalDistance = 0; // Keep track of accumulated distance
let roundDistances = []; // Array to store distance for each round

// Custom user marker icon
const LeafIcon = L.Icon.extend({
  options: {
    iconSize: [30, 41],
    iconAnchor: [15, 40],
  },
});

const greenIcon = new LeafIcon({
  iconUrl: "https://cdn.glitch.global/f4cb3da3-e38f-4c57-8538-cd16160b85b3/_265a5cce-4ba0-4c1c-a76f-a7d5f00d8ea0-removebg-preview%20(1).png?v=1705859478915",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

let randomIndex;
let idSetInterval;
let userMarker;

function postScoreToBluesky(totalDistance) {
  const message = encodeURIComponent(
    `I traveled ${totalDistance} kilometers hunting ghosts! <br> Play https://tripgeo.com/nightmareonviewstreet and see if you can beat my score.`
  );
  const blueskyPostUrl = `https://bsky.app/intent/compose?text=${message}`;
  console.log("Bluesky Post URL:", blueskyPostUrl); // Debugging statement
  window.open(blueskyPostUrl, "_blank");
}

function postScoreToTwitter(totalDistance) {
  const message = encodeURIComponent(
    `I traveled ${totalDistance} kilometers hunting ghosts! Play https://tripgeo.com/nightmareonviewstreet and see if you can beat my score.`
  );
  const TwitterPostUrl = `https://twitter.com/intent/tweet?text=${message}`;
  console.log("Twitter Post URL:", TwitterPostUrl); // Debugging statement
  window.open(TwitterPostUrl, "_blank");
}

function generateAndPlay(remainingPoints) {
  if (remainingPoints.length === 0) {
    // End of game logic

    if (userMarkers.length !== 0) {
      // Fit the map to the user-added markers
      const bounds = new L.LatLngBounds();
      userMarkers.forEach(function (markerLatLng) {
        bounds.extend(markerLatLng);
      });
      map.fitBounds(bounds);
    }

    // Remove round 5 picture
    ghostinfo.innerHTML = "";

    // Add the "Play Again" button
    const playAgainButton = document.createElement("subbutton");
    playAgainButton.id = "playAgainBtn";
    playAgainButton.innerText = "Play again";
    playAgainButton.className = "my-button";

    // Add click event listener to the button
    playAgainButton.addEventListener("click", function () {
      location.reload();
    });

    document.getElementById("playagain").appendChild(playAgainButton);

    // Save personal best scores
    const personalBest = localStorage.getItem("personalBest");

    if (personalBest === null || totalDistance < parseFloat(personalBest)) {
      localStorage.setItem("personalBest", totalDistance.toFixed(2));
    }

    // Create a container for the social media buttons
const socialButtonsContainer = document.createElement("div");
socialButtonsContainer.className = "social-buttons"; // Add the class for styling

// Create Bluesky button
const blueskyButton = document.createElement("subbutton");
blueskyButton.innerHTML = `
  <div class="tooltip">
    <button onclick="postScoreToBluesky(totalDistance.toFixed(2))">
      <img
        src="https://cdn.glitch.global/5c79659d-2de3-48c0-b764-8b0e57d2e123/Bluesky_Logo.svg.png?v=1726579976732"
        id="bluesky-button"
        alt="Logo"
        style="height: 18px; vertical-align: middle; cursor: pointer"
      />
    </button>
    <div class="tooltiptext">Share on Bluesky</div>
  </div>
`;

// Create Twitter button
const twitterButton = document.createElement("subbutton");
twitterButton.innerHTML = `
  <div class="tooltip">
    <button onclick="postScoreToTwitter(totalDistance.toFixed(2))">
      <img
        src="https://cdn.glitch.global/5c79659d-2de3-48c0-b764-8b0e57d2e123/logo-black.png?v=1726492469512"
        id="twitter-button"
        alt="Logo"
        style="height: 18px; vertical-align: middle; cursor: pointer"
      />
    </button>
    <div class="tooltiptext">Share on X</div>
  </div>
`;

// Append the buttons to the container
socialButtonsContainer.appendChild(blueskyButton);
socialButtonsContainer.appendChild(twitterButton);

// Append the container to the playagain div
document.getElementById("playagain").appendChild(socialButtonsContainer);
    
    // Display game score
    station.style.color = "#333";
    station.innerHTML = `Game ended<br><br>
    ${roundDistances
      .map((distance, index) => `round ${index + 1}: ${distance.toFixed(2)} kilometres`)
      .join("<br>")}<br>
    <br>Total distance: ${totalDistance.toFixed(2)} kilometers.<br>
    Best game: ${localStorage.getItem("personalBest")} kilometers.`;

    document
      .getElementById("station")
      .animate(
        [
          { transform: "rotate(-10deg)" },
          { transform: "rotate(10deg)" },
          { transform: "rotate(-10deg)" },
          { transform: "rotate(10deg)" },
          { transform: "rotate(-10deg)" },
          { transform: "rotate(10deg)" },
        ],
        {
          duration: 1000,
          iterations: 1,
        }
      );

    return;
    }

  randomIndex = Math.floor(Math.random() * remainingPoints.length);
  const referencePoint = remainingPoints[randomIndex];

  const roundNumber = Math.ceil(5 - remainingPoints.length + 1); // Calculate round number

  const capitalizedRound = "round".charAt(0).toUpperCase() + "round".slice(1);
  station.innerHTML = `${capitalizedRound}  ${roundNumber}.<br>`;
  ghostinfo.innerHTML = `${stationInfo[referencePoint]}<br><div id="myProgress"><div id="myBar"></div></div>`;

  document.getElementById("myProgress").style.display = "block";

  move(remainingPoints);

  map.off("click"); // Remove previous click event listener

  // Function to create the midpoint variable
  function createMidpoint(markerLatLng, referencePointLatLng) {
    const markerLat = markerLatLng.lat;
    const markerLng = markerLatLng.lng;
    const referencePointLat = referencePointLatLng.lat;
    const referencePointLng = referencePointLatLng.lng;

    // Calculate the midpoint's latitude and longitude
    const midpointLat = (markerLat + referencePointLat) / 2;
    const midpointLng = (markerLng + referencePointLng) / 2;

    // Create the midpoint L.latLng object
    const midpoint = L.latLng(midpointLat, midpointLng);

    return midpoint;
  }

  map.on("click", function (e) {

    myDiv.innerHTML = "Click again to move the marker.<br>Click on 'Enter' to submit your guess.";

    // Add user marker to the array

    if (userMarker) {
      map.removeLayer(userMarker); // Remove the previous marker
    }

    userMarker = L.marker(e.latlng).addTo(map); // Add the new marker
    userMarker._icon.classList.add("huechange");
    userMarkers.push(userMarker.getLatLng());

    //add submitbutton
    document.getElementById("buttonsdiv").appendChild(submitButton);

    submitButton.onclick = function () {

      document.getElementById("myProgress").style.display = "none";
      clearInterval(idSetInterval);

      const marker = L.marker(e.latlng).addTo(map);
      marker._icon.classList.add("huechange");
      const distance = L.latLng(e.latlng).distanceTo(referencePoint);
      map.off("click");

      // Create a bounds object encompassing both markers
      const bounds = L.latLngBounds([e.latlng, referencePoint]);

      // Zoom the map to fit those bounds
      map.fitBounds(bounds);

      //remove submit button and add next painting button
      document.getElementById("buttonsdiv").appendChild(nextButton);
      document.getElementById("buttonsdiv").removeChild(submitButton);

      // Convert meters to miles:
      //const distanceInMiles = distance * 0.000621371;
      const distanceInKilometers = distance * 0.001;

      myDiv.innerHTML = `You clicked ${distanceInKilometers.toFixed(2)} kilometers from the correct location`;
        
      // Create the midpoint variable and display message
      const midpoint = createMidpoint(e.latlng, referencePoint);

      let backgroundColor = '';
      let gaEventDistance = '';

      if (distanceInKilometers < 0.5) {
        backgroundColor = 'rgba(0, 128, 0, 0.9)';
        gaEventDistance = "Less than 500m";
      } else if (distanceInKilometers < 2) {
        backgroundColor = 'rgba(139, 197, 0, 0.9)';
        gaEventDistance = "Less than 2000m";
      } else if (distanceInKilometers < 10) {
        backgroundColor = 'rgba(202, 180, 0, 0.9)';
        gaEventDistance = "Less than 10000m";
      } else if (distanceInKilometers < 25) {
        backgroundColor = 'rgba(255, 127, 14, 0.9)';
        gaEventDistance = "Less than 25000m";
      } else {
        backgroundColor = 'rgba(255, 0, 0, 0.9)';
        gaEventDistance = "More 25000m";
      }


      // emojis from https://www.w3schools.com/charsets/ref_emoji_smileys.asp
      const popup = L.popup().setLatLng(midpoint)
        .setContent(
          distanceInKilometers < 0.25
            ? "Perfect <span style='font-size:24px;'>&#128512;</span>"
            : distanceInKilometers < 1
            ? "Quite good <span style='font-size:24px;'>&#128521;</span>"
            : distanceInKilometers < 5
            ? "OK <span style='font-size:24px;'>&#128558;</span>"
            : distanceInKilometers < 10
            ? "Not good <span style='font-size:24px;'>&#128551;</span>"
            : "Way Off!! <span style='font-size:24px;'>&#128553;</span>" // Default message for distances 100 km or more
        )
        .openOn(map);

      // Set background color dynamically
      const popupWrapper = document.querySelector('.leaflet-popup-content-wrapper');
      if (popupWrapper) {
        popupWrapper.style.backgroundColor = backgroundColor;
      }

      // Update total distance with clicked marker's distance
      totalDistance += distanceInKilometers;
      roundDistances.push(distanceInKilometers); // Add distance to the roundDistances array
      // connect user marker to correct location
      const polyline = L.polyline([e.latlng, referencePoint], styleLine).addTo(map);

      // Put marker on correct location
      const stationMarker = L.marker(referencePoint, { icon: greenIcon }).addTo(
        map
      );

      // Remove the used reference point from the remaining pool
      remainingPoints.splice(randomIndex, 1);
      
           
    };
  });

  // Enable next button when a new game round starts
  nextButton.disabled = false;

  // Handle next button click
  nextButton.onclick = function () {
    //remove popup message
    map.closePopup();
    // Change button text to "Results" on the fifth question
    if (roundNumber === 4) {
      nextButton.innerText = "Results";
    }

    //remove next button and add submit painting button
    document.getElementById("buttonsdiv").removeChild(nextButton);
    map.setView([51.512547,-0.1383914], 11);
    document
      .getElementById("station")
      .animate(
        [
          { transform: "translateX(-3px)" },
          { transform: "translateX(3px)" },
          { transform: "translateX(-3px)" },
          { transform: "translateX(3px)" },
          { transform: "translateX(-3px)" },
          { transform: "translateX(3px)" },
        ],
        {
          duration: 1000,
          iterations: 1,
        }
      );

    generateAndPlay(remainingPoints);
    myDiv.innerHTML = "Click on map";
  };
}

function move(remainingPoints) {
  var elem = document.getElementById("myBar");
  var width = 100; // Initial width set to 100%
  var decrementRate = 1; // Decrement rate for width
  var duration = 60 * 1000; // Duration in milliseconds
  var intervalTime = 60; // Interval time in milliseconds
  var steps = duration / intervalTime; // Total steps

  var stepWidth = width / steps; // Width to decrement at each step

  idSetInterval = setInterval(frame, intervalTime);
  
  function frame() {
    if (width <= 0) {
      clearInterval(idSetInterval);
      
      remainingPoints.splice(randomIndex, 1); // Remove the used reference point from the remaining pool
      // if submitButton ("Comprovar") exists, then remove it
      document.getElementById("buttonsdiv").contains(submitButton) ? document.getElementById("buttonsdiv").removeChild(submitButton) : false;
      document.getElementById("buttonsdiv").appendChild(nextButton);
      // Remove marker if there is on map
      //userMarkers.slice(0, -1);

      if (userMarker) {
        map.removeLayer(userMarker); // Remove the previous marker
      }

      userMarkers.pop();

      roundDistances.push(300); // Add max distance


    } else {
      width -= stepWidth;
      elem.style.width = width + "%";
      // Dynamically adjust color from green to yellow/orange to red based on width
      var startColor = [200, 0, 40]; // Green: rgb(0,145,40)
      var midColor = [255, 205, 0]; // Orange: rgb(255,165,0)
      var endColor = [0, 145, 40]; // Red: rgb(200,0,40)
      var red, green, blue;

      if (width >= 50) {
        // Transition from green to yellow/orange
        var ratio = (width - 50) / 50;
        red = Math.round(midColor[0] + (endColor[0] - midColor[0]) * ratio);
        green = Math.round(midColor[1] + (endColor[1] - midColor[1]) * ratio);
        blue = Math.round(midColor[2] + (endColor[2] - midColor[2]) * ratio);
      } else {
        // Transition from yellow/orange to red
        var ratio = width / 50;
        red = Math.round(startColor[0] + (midColor[0] - startColor[0]) * ratio);
        green = Math.round(startColor[1] + (midColor[1] - startColor[1]) * ratio);
        blue = Math.round(startColor[2] + (midColor[2] - startColor[2]) * ratio);
      }

      elem.style.backgroundColor = "rgb(" + red + "," + green + "," + blue + ")";
    }
  }

}

const locationNames = {
  [trafalgar]: "Trafalgar Square",
  [orbit]: "Orbit",
  [bridge]: "Tower Bridge",
  [museum]: "British Museum",
  [globe]: "The Globe",
  [eye]: "London Eye",
  [shard]: "The Shard",
  [palace]: "Buckingham Palace",
  [albert]: "Royal Albert Hall",
  [wembley]: "Wembley Stadium",
  [market]: "Leadenhall Market",
  [nhm]: "Natural History",
  [pic]: "Piccadilly Circus",
  [power]: "Battersea Power Station",
  [dome]: "Millennium Dome",
  
};

const stationInfo = {
  [trafalgar]:
    '<video src="https://cdn.glitch.global/be3a6f3e-c7c5-4e7a-859d-dc152b1863e5/304142599903195139.mp4?v=1729414457400" autoplay loop class="center responsive-video" onclick="this.requestFullscreen()"></video>',
  [orbit]:
    '<video src="https://cdn.glitch.global/be3a6f3e-c7c5-4e7a-859d-dc152b1863e5/304330470723366916.mp4?v=1729423289277" autoplay loop class="center responsive-video" onclick="this.requestFullscreen()"></video>',
  [bridge]:
    '<video src="https://cdn.glitch.global/be3a6f3e-c7c5-4e7a-859d-dc152b1863e5/304327380184010756.mp4?v=1729423795897" autoplay loop class="center responsive-video" onclick="this.requestFullscreen()"></video>',
  [museum]:
    '<video src="https://cdn.glitch.global/be3a6f3e-c7c5-4e7a-859d-dc152b1863e5/304374034308206596.mp4?v=1729431564453" autoplay loop class="center responsive-video" onclick="this.requestFullscreen()"></video>',
  [globe]:
    '<video src="https://cdn.glitch.global/be3a6f3e-c7c5-4e7a-859d-dc152b1863e5/304644470833094664.mp4?v=1729498739200" autoplay loop class="center responsive-video" onclick="this.requestFullscreen()"></video>',
  [eye]:
    '<video src="/videos/London%20Eye.mp4?v=1729499047171" autoplay loop class="center responsive-video" onclick="this.requestFullscreen()"></video>',
  [shard]:
    '<video src="https://cdn.glitch.global/be3a6f3e-c7c5-4e7a-859d-dc152b1863e5/Shard%202.mp4?v=1729586253920" autoplay loop class="center responsive-video" onclick="this.requestFullscreen()"></video>',
  [palace]:
    '<video src="https://cdn.glitch.global/be3a6f3e-c7c5-4e7a-859d-dc152b1863e5/305070507106709513.mp4?v=1729593571745" autoplay loop class="center responsive-video" onclick="this.requestFullscreen()"></video>',
  [albert]:
    '<video src="https://cdn.glitch.global/be3a6f3e-c7c5-4e7a-859d-dc152b1863e5/305120562429759497.mp4?v=1729629794528" autoplay loop class="center responsive-video" onclick="this.requestFullscreen()"></video>',
  [wembley]:
    '<video src="https://cdn.glitch.global/be3a6f3e-c7c5-4e7a-859d-dc152b1863e5/305480621391319045.mp4?v=1729697440709" autoplay loop class="center responsive-video" onclick="this.requestFullscreen()"></video>',
  [market]:
    '<video src="https://cdn.glitch.global/be3a6f3e-c7c5-4e7a-859d-dc152b1863e5/305788378434760704.mp4?v=1729783224530" autoplay loop class="center responsive-video" onclick="this.requestFullscreen()"></video>',
  [nhm]:
    '<video src="https://cdn.glitch.global/be3a6f3e-c7c5-4e7a-859d-dc152b1863e5/nhm.mp4?v=1729783456344" autoplay loop class="center responsive-video" onclick="this.requestFullscreen()"></video>',
  [pic]:
    '<video src="https://cdn.glitch.global/be3a6f3e-c7c5-4e7a-859d-dc152b1863e5/306142575340564485.mp4?v=1729858935616" autoplay loop class="center responsive-video" onclick="this.requestFullscreen()"></video>',
  [power]:
    '<video src="https://cdn.glitch.global/be3a6f3e-c7c5-4e7a-859d-dc152b1863e5/Untitled%20design.mp4?v=1730034761277" autoplay loop class="center responsive-video" onclick="this.requestFullscreen()"></video>',
  [dome]:
    '<video src="https://cdn.glitch.global/be3a6f3e-c7c5-4e7a-859d-dc152b1863e5/307290099917025281.mp4?v=1730151784135" autoplay loop class="center responsive-video" onclick="this.requestFullscreen()"></video>',
  
};

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Start the game with all reference points

function toPlay() {

  playbutton.remove();
  const shuffledEntries = [
    trafalgar, orbit, bridge, museum, globe, eye, shard, palace, albert, wembley, market, nhm, pic, power, dome
  ];
    //select 5 random pictures
  //  .slice()
  //  .sort(() => Math.random() - 0.5); // Shuffle using Fisher-Yates
  //const randomEntries = shuffledEntries.slice(0, 5);


  const shuffled = shuffleArray([...shuffledEntries]);
  const randomEntries = shuffled.slice(0, 5);

  generateAndPlay(randomEntries);
  myDiv.innerHTML = "Click on the map";
}

function addMarkers(map) {
  var markers = [
    trafalgar, orbit, bridge, museum, globe, eye, shard, palace, albert, wembley, market, nhm, pic, power, dome
  ];

  for (var i = 0; i < markers.length; i++) {
    var marker = L.marker(markers[i], {
      icon: greenIcon,
      referencePoint: markers[i]
    });

    marker.addTo(map).on('click', function() {

      var markerKey = this.options.referencePoint;
      var correctContent = stationInfo[markerKey];
      document.getElementById('ghostinfo').innerHTML = correctContent + '<br>';
    });
  }
}

var mapSequence = [];

document.addEventListener("keydown", function (event) {
  mapSequence.push(event.key);

  if (mapSequence.length === 3 && mapSequence.join("") === "map") {
    event.preventDefault();
    mapSequence = [];
    addMarkers(map);
  } else if (mapSequence.length > 3) {
    mapSequence = [];
  }
});

document.getElementById("about").addEventListener("click", function(event) {
  event.preventDefault();
  
  const ghostinfo = document.getElementById("ghostinfo");
  const playbutton = document.getElementById("playbutton");
  const home = document.getElementById("home");
  const aboutContent = document.getElementById("aboutContent");
  const about = document.getElementById("about");

  if (ghostinfo) {
    ghostinfo.style.display = "none";
  }

  if (playbutton) {
    playbutton.style.display = "none";
  }

  if (home) {
    home.classList.remove("active");
  }

  if (aboutContent) {
    aboutContent.style.display = "block";
  }

  if (about) {
    about.classList.add("active");
  }
  
});

document.getElementById("home").addEventListener("click", function(event) {
  event.preventDefault();

  const ghostinfo = document.getElementById("ghostinfo");
  const playbutton = document.getElementById("playbutton");
  const home = document.getElementById("home");
  const aboutContent = document.getElementById("aboutContent");
  const about = document.getElementById("about");
  
  if (ghostinfo) {
    ghostinfo.style.display = "block";
  }

  if (playbutton) {
    playbutton.style.display = "block";
  }

  if (home) {
    home.classList.add("active");
  }

  if (aboutContent) {
    aboutContent.style.display = "none";
  }

  if (about) {
    about.classList.remove("active");
  }

});

 // Function to toggle fullscreen mode
        function toggleFullscreen() {
            // Check if the document is already in fullscreen mode
            if (!document.fullscreenElement) {
                // If not, request fullscreen
                document.documentElement.requestFullscreen().catch(err => {
                    alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
                });
            } else {
                // If in fullscreen, exit fullscreen
                document.exitFullscreen();
            }
        }

        // Add event listener to the button
        document.getElementById('fullscreenBtn').addEventListener('click', toggleFullscreen);
