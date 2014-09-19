var Locations = {

	base2: "https://api.foursquare.com/v2/venues/explore",
	base3: "https://api.worldweatheronline.com/free/v1/weather.ashx",
	params2: {client_id: "HBMVGNAHBQMV5A0FM3RLUM1NIXXZ1CU4XXOLCOP4GLXGGBHC", client_secret: "Q4RXJT4IZVWALD1HIOWNKXVUPVJZBUJ5JEPDU4HYD1KVF1GD", section: "shops", v: "20130815"},
	params3: {format: 'json', key: 'f83676bdb9c2eee1f780967602c8faf1fd4d1cb9'},
	
	fetchLocations: function() {
		if(navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position){
				Locations.params2.ll = position.coords.latitude + ',' + position.coords.longitude;
				console.log(position);
				$.getJSON(Locations.base2, Locations.params2, function(response) {
					console.log(response.response.groups[0]);
	        		Locations.postLocations(response);
	        		
	        	});
	        	Locations.params3.q = position.coords.latitude + ',' + position.coords.longitude;
	        	$.getJSON(Locations.base3, Locations.params3, function(response1) {
	        		console.log(response1);
	        		Locations.postWeatherCondition(response1);
	        	});
	  
	        	var center =  position.coords.latitude + ',' + position.coords.longitude;
	        	var map = '<iframe width="90%" height="400" frameborder="0" style="border:0" src="https://www.google.com/maps/embed/v1/view?key=AIzaSyDzBjNNTZDL-eYH_Nbth3IMZTcGN3PR7aw&zoom=3&center=' + center + '&maptype=satellite"></iframe>';
				$('#Map').append(map);    	
			});
		} else {
	       $('.error').html("Geolocation is not supported by this browser.");
	    }
		
	},


	postWeatherCondition: function(response1) {
		var weather = response1.data.current_condition[0];
			var post = this;
			var weatherIcon= '<img id="weatherIcon" src="' + weather.weatherIconUrl[0].value + '" />';
			$('#weatherCast').append(weatherIcon);
			var weatherCondition = '<div id="weatherCondition">' + weather.weatherDesc[0].value + '</div>';
			$('#weatherCast').append(weatherCondition);
			var currentDate = '<div id="date">' + response1.data.weather[0].date + '</div>';
			$('#weatherCast').append(currentDate);
			var tempDegree = '<div id="temp">' + 'MaxTemp: ' + weather.temp_C + '&deg C' + '</div>';
			$('#weatherCast').append(tempDegree);
			var timeObserved = '<div id="time">' + 'Observed: ' + weather.observation_time  + '</div>';
			$('#weatherCast').append(timeObserved);
	},

	


	postLocations: function(response) {
		var shops = response.response.groups[0];
		if (shops.items.length !== 0) {
			$.each(shops.items, function() {
				var post = this;
				var nameOfShop = '<div id="shopName">' + post.venue.name + '</div>';
				$('.container').append(nameOfShop);
				var tipped = '<div id="tips">' + 'Popular tip: ' + post.tips[0].text + '.. Votes: ' + post.tips[0].likes.summary + '.' + '</div>';
				$('.container').append(tipped);
				var addressOfShop = '<div id="address">' + post.venue.location.formattedAddress + '</div>'
										+ '<iframe class="smaller" width="70%" height="300" frameborder="0" style="border:0" src="https://www.google.com/maps/embed/v1/view?key=AIzaSyDzBjNNTZDL-eYH_Nbth3IMZTcGN3PR7aw&zoom=16&center=' + post.venue.location.lat + ',' + post.venue.location.lng + '&maptype=roadmap"></iframe>';
				$('.container').append(addressOfShop);
				$('.smaller').hide();
				var showOnMapButton = '<input type="button" value="Show on Map" id="showOnMap"/>';
				$('.container').append(showOnMapButton);
				var divideLine = '<div class="line"></div>';
				$('.container').append(divideLine);
				$('.container').hide();
			});
		}
		else {return $('#noItem').text('Sorry, No shops around you');
		}
		
	},

	
	switchTabsToNextPage: function(event){
		event.preventDefault();
		$('.container').show();
		$('#Map').hide();
		$('#nearByShops').hide();
		$('#homePage').show();
	},

	switchTabsToHomePage: function(event){
		event.preventDefault();
		$('.container').hide();
		$('#Map').show();
		$('#nearByShops').show();
		$('#homePage').hide();
	},

	showThisLocationOnMap: function(event){
		event.preventDefault();
		$(this).hide();
		$(this).prev('.smaller').show();
	},


	initialize: function() {
		Locations.fetchLocations();
		$('#homePage').hide();
		$('#nearByShops').on('click', Locations.switchTabsToNextPage);
		$('#homePage').on('click', Locations.switchTabsToHomePage);
		$('.container').on('click', 'input[type=button]', Locations.showThisLocationOnMap);
	
	
	}


}

$(document).ready(Locations.initialize);
