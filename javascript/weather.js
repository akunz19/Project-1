$(document).ready(function(){
    $('#getZipCode').click(function(){ // Create or match HTML I
        var zipCode = 'zip=' + $('#zipCode').val().trim(); // Create or match HTML Id
        var apiKey = '&appid=ed6ad32dd8070a6ab3e2194ab69a5010';
        var getURL = 'https://api.openweathermap.org/data/2.5/weather?' + zipCode + apiKey;

        $.ajax({
            url: getURL,
            method: 'GET',
        }).then(function (response){
            console.log(getURL);
            console.log(response);
            console.log(response.weather[0].main);
/*          $('#showWeatherInfo').text('Current conditions: ' + response.weather[0].main) */ 
        })
    })
})

// Link #zipCode from line 3 and #showWeatherInfo from line 14 to HTML code & test