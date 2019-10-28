$(document).ready(function(){
    $('#generateZip').click(function(){ // Create or match HTML I
        var zipCode = 'zip=' + $('#zipCode').val().trim();
        var apiKey = '&appid=ed6ad32dd8070a6ab3e2194ab69a5010';
        var getURL = 'https://api.openweathermap.org/data/2.5/weather?' + zipCode + apiKey;

        $.ajax({
            url: getURL,
            method: 'GET',
        }).then(function (response){
            console.log(getURL);
            console.log(response);

            // Weather code conditions to display on HTML
            console.log(Math.ceil(response.main.temp) + ' °F'); // Current temperature
            console.log(response.name); // City
            console.log(response.weather[0].main); // Current conditions
            console.log(response.clouds.all + '%'); // Cloudiness
            console.log(response.main.humidity + '%'); // Current humidity
            console.log(response.wind.speed + ' m/h'); // Current wind speed

        })
    })
})