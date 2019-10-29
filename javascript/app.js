$(document).ready(function() {
    var clientID = "a0ee7d1e23dc4b14ac56e93bb2a390ce";
    var redirectURI = "http://127.0.0.1:5501/index.html";
    var scopes =
      "user-follow-read user-read-private user-read-email user-read-private playlist-read-private user-library-read user-library-modify user-top-read playlist-read-collaborative playlist-modify-public playlist-modify-private";
    var url =
      "https://accounts.spotify.com/authorize?client_id=" +
      clientID +
      "&response_type=token" +
      "&redirect_uri=" +
      redirectURI +
      "&scope=" +
      scopes;
    var user = {};
    var currentWeather = {};
    var imageArray= [];
    var trackidArray = [];
    var trackURIArray = [];
    var objarrayUri = [];
    var artistIDArray = [];
    var artistNameArray = [];
    var trackNameArray = [];
    var trackFeatureArray = [];
    var trackObjArray = [];
    var playlist = [];
    var playlistID;
    var weather;
    var currentTemp;
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    console.log("app.js");
  
    function spotifyLogin() {
      window.location.href = url;
      isLoggedIn = true;
      console.log("I did it! spotifylogin");
    }
    function getToken() {
      var currentURL = window.location.href;
      var curSplit = currentURL.split("#access_token="); //this turns currentURL into an array
      console.log(curSplit);
      if (curSplit.length > 1) {
        var params = curSplit[1];
        var code = params.split("&")[0]; //returns '0' index of split params array
        console.log(code);
        localStorage.setItem("loggedin", "true");
        return code;
      }
    }
  
    var token = getToken(); // calls getToken
  
    var logincheckCall = loginChecker(); //calls loginChecker
  
    function loginChecker() {
      console.log("inside loginChecker");
      if (localStorage.getItem("loggedin")) {
        getUser();
        $("#login-container").detach();
        localStorage.removeItem("loggedin");
        getData();
        $("#zipCode").show();
      }
    }
  
    function getUser() {
      var queryURL = "https://api.spotify.com/v1/me";
      $.ajax({
        url: queryURL,
        method: "GET",
        headers: {
          Authorization: "Bearer " + token
        }
      }).then(function(response) {
        console.log("getUser is running", response);
        user.id = response.id;
        user.country = response.country;
        user.name = response.display_name;
        console.log("this is the user: ", user);
      });
    }
  
    $("#spotify_login").on("click", function() {
      spotifyLogin();
    });
  
    $("#generateZip").on("click", function() {
      genWeather(); //creates playlist
      $("#zipCode").detach();
      $("#playlist").show();
    });
  
    function sunnyLogic() {
      var searchCount = 0;
      console.log("hello, I'm here sunny logic");
      while (searchCount < 10) {
        var index = Math.floor(Math.random() * trackObjArray.length);
        if (
          trackObjArray[index].energy >= 0.4 &&
          !trackObjArray[index].isSelected
        ) {
          console.log("inside sunnforloop sunny");
          trackObjArray[index].isSelected = true;
          objarrayUri.push(trackObjArray[index].uri);
          $("#artistCarousel").append("<div class='cover'><img src='"+trackObjArray[index].image+"' alt='ROCK MUSIC'><div class='overlay'><div class='text align-middle'>"+trackObjArray[index].artist+"</div></div></div>");
          playlist.push(trackObjArray[index]);
          searchCount++;
        }
      }
    }
  
    function cloudyLogic() {
      var searchCount = 0;
      console.log("hello, cloudlyLogic");
      while (searchCount < 10) {
        var index = Math.floor(Math.random() * trackObjArray.length);
        if (
          trackObjArray[index].energy <= 0.399 &&
          !trackObjArray[index].isSelected
        ) {
          console.log("inside forloop cloudy");
          trackObjArray[index].isSelected = true;
          objarrayUri.push(trackObjArray[index].uri);
          $("#artistCarousel").append("<div class='cover'><img src='"+trackObjArray[index].image+"' alt='ROCK MUSIC'><div class='overlay'><div class='text align-middle'>"+trackObjArray[index].artist+"</div></div></div>");
          playlist.push(trackObjArray[index]);
          searchCount++;
        }
      }
    }
  
    function createplaylistContainer() {
      console.log("creatingplaylist");
      var queryURL = "https://api.spotify.com/v1/users/" + user.id + "/playlists";
      $.ajax({
        url: queryURL,
        method: "post",
        headers: {
          Authorization: "Bearer " + token
        },
        data: JSON.stringify({
          public: true,
          name: user.name + "'s " + weather + " day playlist!"
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json"
      }).then(function(response) {      
        playlistID = response.id;
        addTracks();
      });
    }
  
    function addTracks() {
      var uriStr = gentrackuriStr();
      var queryURL =
        "https://api.spotify.com/v1/playlists/" +
        playlistID +
        "/tracks?uris=" +
        uriStr;
      $.ajax({
        url: queryURL,
        method: "post",
        headers: {
          Authorization: "Bearer " + token
        },
        contentType: "application/json; charset=utf-8",
        dataType: "json"
      }).then(function(response) {
        $("#userName").append(user.name);
        $("#spotify-widget").append("<iframe src='https://open.spotify.com/embed/playlist/"+playlistID+"' width='500' height='380' frameborder='0' allowtransparency='true' allow='encrypted-media'></iframe>")
        $("#location").append(currentWeather.city);
        $("#iconandtemp").append("<img id='weatherIcon' src='"+currentWeather.icon+"'>");
        $("#temp").append(currentWeather.temp);
        $("#date").append(date);
        $("#descWord").append(weather);
        $("#cloudiness").append(currentWeather.cloudiness);
        $("#humidity").append(currentWeather.humidity);
        $("#wind").append(currentWeather.windspeed);
      });
    }
  
    function genWeather() {
      console.log("generating weather");
      var zipCode =
        "zip=" +
        $("#ZipCode")
          .val()
          .trim(); // Create or match HTML Id
      var apiKey = "&appid=ed6ad32dd8070a6ab3e2194ab69a5010";
      var getURL =
        "https://api.openweathermap.org/data/2.5/weather?" + zipCode +"&units=imperial&"+ apiKey;
      $.ajax({
        url: getURL,
        method: "GET"
      }).then(function(response) {
        weather = response.weather[0].main;
        var temp = response.main.temp;
        currentTemp = Math.round(temp)+"°F";
        currentWeather.temp = currentTemp;
        currentWeather.city = response.name;
        currentWeather.icon = "http://openweathermap.org/img/wn/"+response.weather[0].icon+"@2x.png";
        currentWeather.windspeed = response.wind.speed + "mph";
        currentWeather.humidity = response.main.humidity + "%";
        currentWeather.cloudiness = response.clouds.all + "%";
        console.log(weather);
        console.log(currentWeather);
        if (weather === "Clear") {
          sunnyLogic();
          createplaylistContainer();
          console.log(playlist);
        } else if (weather === "Clouds") {
          cloudyLogic();
          createplaylistContainer();
          console.log(playlist);
        } else if (
          weather === "Rain" ||
          weather === "Drizzle" ||
          weather === "Thunderstorm"
        ) {
          cloudyLogic();
          createplaylistContainer();
          console.log(playlist);
        } else {
          console.log("other");
          sunnyLogic();
          createplaylistContainer();
          console.log(playlist);
        }
        console.log("openweather response ", response);
        console.log("before weather");
      });
    }
  
    /*everything below here goes into the dataButton*/
  
    //get top played tracks of user's top artists
  
    function getData() {
      console.log("getdata");
      var queryURL = "https://api.spotify.com/v1/me/top/artists"; //get top played artists
      $.ajax({
        url: queryURL,
        method: "GET",
        headers: {
          Authorization: "Bearer " + token
        }
      }).then(function(response) {
        for (var i = 0; i < response.items.length; i++) {
          //get top played artists IDs
          var artist = response.items[i].id;
          artistIDArray.push(artist); //array of top played artist IDs
        }
        console.log(response);
        console.log("calling getTracks");
        getTracks(0);
      });
    }
  
    function getTracks(j) {
      var artistID = artistIDArray[j];
      var topTrackUrl =
        "https://api.spotify.com/v1/artists/" +
        artistID +
        "/top-tracks?country=" +
        user.country;
      $.ajax({
        url: topTrackUrl,
        method: "GET",
        headers: {
          Authorization: "Bearer " + token
        }
      }).then(function(response) {
        idLoop(response, 0);
        j++;
        if (j < artistIDArray.length) {
          getTracks(j);
        } else {
          console.log("running genAudioFeatures");
          console.log("getTracks response", response);
          console.log("images", imageArray);
          genAudioFeatures();
        }
      });
    }
  
    function genidStr() {
      //generates track id string
      console.log("i did it! genID");
      var idJoin = trackidArray.join(",");
      return idJoin;
    }
  
    function gentrackuriStr() {
      //generates track id string
      console.log("i did it!, gentrackuriStr");
      var uriJoin = objarrayUri.join(",");
      return uriJoin;
    }
  
    function idLoop(response, i) {
      trackidArray.push(response.tracks[i].id);
      trackURIArray.push(response.tracks[i].uri);
      artistNameArray.push(response.tracks[i].artists[0].name);
      trackNameArray.push(response.tracks[i].name);
      imageArray.push((response.tracks[i].album.images[0].url));
      i++;
      if (i < 5) {
        idLoop(response, i);
      } else {
        console.log("idloop done");
      }
    }
  
    function genAudioFeatures() {
      var idStr = genidStr(); //calls function
      console.log("Calling audio features API");
      var queryTrackData =
        "https://api.spotify.com/v1/audio-features?ids=" + idStr; //gets audio features
      return $.ajax({
        url: queryTrackData,
        method: "GET",
        headers: {
          Authorization: "Bearer " + token
        }
      }).then(function(response) {
        console.log("audio feature promise");
        for (var i = 0; i < response.audio_features.length; i++) {
          console.log("audio feature promise forloop");
          trackFeatureArray.push(response.audio_features[i]);
        }
        console.log("calling maketrackObjs");
        maketrackObjs();
      });
    }
  
    function maketrackObjs() {
      for (var i = 0; i < 100; i++) {
        var obj = {
          artist: artistNameArray[i],
          title: trackNameArray[i],
          image: imageArray[i],
          energy: trackFeatureArray[i].energy,
          uri: trackURIArray[i],
          isSelected: false
        };
        trackObjArray.push(obj);
      }
    }
  });
  