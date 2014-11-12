var UsersCollection = Backbone.Collection.extend({
	url: "/users"
})



var StartEndPoints = Backbone.View.extend({
	tagName: "div",
	attributes: {
		class: "col-xs-offset-3 col-sm-offset-3 col-md-offset-3 col-lg-offset-3 col-xs-6 col-sm-6 col-md-6 col-lg-6 search-box"
	},
	template: _.template($("#start-end-points").html() ),
	initialize: function(){
		this.render()
	},
	render: function(){ 
		var StartEnd = this.$el.html(this.template);
		$("div.container").empty();
		$("div.container").append(StartEnd);
	},
	getStartEndPoints: function(){
		startingPoint = $("input.start").val()
		endingPoint = $("input.end").val()
		return [startingPoint, endingPoint]
	}
})


var SpinningWheel = Backbone.View.extend({
	tagName: "div", 
	attributes: {
		class: "spinningWheel col-xs-offset-3 col-sm-offset-3 col-md-offset-3 col-lg-offset-3 col-xs-6 col-sm-6 col-md-6 col-lg-6"
	},
	template: _.template($("#spinningWheel").html() ),
	initialize: function(){
		this.render()
	},
	render: function(){
		var spinningWheel = this.$el.html( this.template() )
		$("div.container").empty()
		$("div.container").append(spinningWheel)
	}
})


var LocationView = Backbone.View.extend({
	tagName: "div", 
	attributes: {
		class: "location col-xs-12 col-s-12 col-md-12 col-lg-12"
	},
	template: _.template( $("#location-names").html() ), 
	initialize: function(results){
		startLocation = results.location_results.start_location;
		endLocation = results.location_results.end_location;
		this.render()
	},
	render: function(){
		var locationView = this.$el.html( this.template() )
		$("div.container").empty()
		$("div.container").append(locationView)
	}
})


var WeatherView = Backbone.View.extend({
	tagName: "div", 
	attributes: {
		class: "weather col-xs-12 col-s-12 col-md-12 col-lg-12"
	},
	template: _.template($("#weather-view").html() ),
	initialize: function(results){
		conditions = results.weather_results.conditions;
		temp = results.weather_results.temp;
		icon = results.weather_results.icon;
		this.render()
	},
	render: function(){
		var weatherView = this.$el.html( this.template() )
		$("div.container").append(weatherView)
	}
})

var WalkingView = Backbone.View.extend({
	tagName: "div",
	attributes: {
		class: "walking col-xs-12 col-s-12 col-md-12 col-lg-12"
	},
	template: _.template($("#walking-view").html() ),
	initialize: function(results, location_results){
		distance = results.walking_results.distance;
		time = results.walking_results.time;
		calories = results.walking_results.calories;
		startLat = results.location_results.start_lat;
		startLng = results.location_results.start_lng;
		endLat = results.location_results.end_lat;
		endLng = results.location_results.end_lng;
		this.render()
	},
	render: function(){
		var walkingView = this.$el.html( this.template() )
		$("div.container").append(walkingView)
	}
})


var BikingView = Backbone.View.extend({
	tagName: "div",
	attributes: {
		class: "biking col-xs-12 col-s-12 col-md-12 col-lg-12"
	},
	template: _.template($("#biking-view").html() ),
	initialize: function(results, location_results){
		distance = results.biking_results.distance;
		time = results.biking_results.time;
		calories = results.biking_results.calories;
		startLat = results.location_results.start_lat;
		startLng = results.location_results.start_lng;
		endLat = results.location_results.end_lat;
		endLng = results.location_results.end_lng;
		this.render()
	},
	render: function(){
		var bikingView = this.$el.html( this.template() )
		$("div.container").append(bikingView)
	}
})


var TransitView = Backbone.View.extend({
	tagName: "div",
	attributes: {
		class: "transit col-xs-12 col-s-12 col-md-12 col-lg-12"
	},
	template: _.template($("#transit-view").html() ),
	initialize: function(results, location_results){
		transit_icon = results.transit_results.transit_icon;
		route_icon = results.transit_results.route_icon;
		duration = results.transit_results.duration;
		distance = results.transit_results.distance;
		startLat = results.location_results.start_lat;
		startLng = results.location_results.start_lng;
		endLat = results.location_results.end_lat;
		endLng = results.location_results.end_lng;
		this.render()
	},
	render: function(){
		var transitView = this.$el.html( this.template() )
		$("div.container").append(transitView)
	}
})

var TaxiView = Backbone.View.extend({
	tagName: "div",
	attributes: {
		class: "taxi col-xs-12 col-s-12 col-md-12 col-lg-12"
	},
	template: _.template($("#taxi-view").html() ),
	initialize: function(results, location_results){
		price = results.taxi_results.price;
		distance = results.taxi_results.distance;
		startLat = results.location_results.start_lat;
		startLng = results.location_results.start_lng;
		endLat = results.location_results.end_lat;
		endLng = results.location_results.end_lng;
		this.render()
	},
	render: function(){
		var taxiView = this.$el.html( this.template() )
		$("div.container").append(taxiView)
	}
})

var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var map;


var GoogleMapsView = Backbone.View.extend({
	tagName: "div",
	attributes: {
		id: "map-canvas",
		class: "col-xs-12 col-sm-12 col-md-8 col-lg-8"
	},
	template: _.template($("#google-maps-view").html() ),
	initialize: function(params){
		directionsDivArrary = this.createDirectionsPanel()
		directionsDiv = directionsDivArrary[0]
		startLat = params.latLng.startLat;
		startLng = params.latLng.startLng;
		endLat = params.latLng.endLat;
		endLng = params.latLng.endLng;
		transitType = params.transitType
		
		directionsDisplay = new google.maps.DirectionsRenderer();
		
		startLocation = new google.maps.LatLng(startLat, startLng);
  	mapOptions = {
    	zoom:5,
    	center: startLocation
  	}
  	
  	map = new google.maps.Map(this.$el[0], mapOptions);
  	directionsDisplay.setMap(map);
 
  	if (transitType == "WALKING"){	
  		directionsDisplay.setPanel(directionsDiv);
  		this.calcRouteWalking()
  	}
  	else if (transitType == "TRANSIT"){ 		
			directionsDisplay.setPanel(directionsDiv);
  		this.calcRouteTransit()
  	};

  	this.render()
	},
	render: function(){
		var googleMaps = this.$el.html( this.template() )
		$("div.container").append(googleMaps)
		$("div.container").append(directionsDiv)
	},
	calcRouteWalking: function() {
	  request = {
	    origin:"" + startLat +","+ startLng,
	    destination:"" + endLat+","+endLng,
	    travelMode: google.maps.TravelMode.WALKING
	  };
	  directionsService.route(request, function(result, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(result);
    	}
  	});
	},
	calcRouteTransit: function() {
  request = {
    origin:"" + startLat +","+ startLng,
    destination:"" + endLat+","+endLng,
    travelMode: google.maps.TravelMode.TRANSIT
  };
  directionsService.route(request, function(result, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(result);
    	}
  	});
	},
	createDirectionsPanel: function(){
		var directionsDiv = $(document.createElement("div"))
		directionsDiv.addClass("directions-panel col-xs-12 col-sm-12 col-md-4 col-lg-4")
		return directionsDiv
	},
})


var GoogleMapsBikeView = Backbone.View.extend({
	tagName: "div",
	attributes: {
		id: "map-canvas",
		class: "col-xs-12 col-sm-12 col-md-8 col-lg-8"
	},
	template: _.template($("#google-maps-view").html() ),
	initialize: function(params){
		directionsDivArrary = this.createDirectionsPanel()
		directionsDiv = directionsDivArrary[0]
		
		
		stations = Object.keys(params.stations)
		mapPoints = []
		infowindow = new google.maps.InfoWindow({
 		});
		for (var i=0; i< stations.length; i++){
			subArray = []
			subArray.push(stations[i])
			subArray.push(params.stations[stations[i]][0].lat)
			subArray.push(params.stations[stations[i]][0].lng)
			subArray.push(i+1)
			mapPoints.push(subArray)
		}

		contentString = []
		for (var i=0; i < stations.length; i++){
			content = "<div id='citibike_popover'> <h3>Station Location: " + stations[i] + "<h3>"
			object = params["stations"][stations[i]][0]
			if (_.has(object, "bikes")){
				content += "<p>Bikes available: " + params["stations"][stations[i]][0]["bikes"] + "</p></div>"
			} else {
			content += "<p>Docks available: " + params["stations"][stations[i]][0]["docks"] + "</p></div>"
			}
			contentString.push(content)
		}

		startLat = params.latLng.startLat;
		startLng = params.latLng.startLng;
		endLat = params.latLng.endLat;
		endLng = params.latLng.endLng;
		transitType = params.transitType
		
		directionsDisplay = new google.maps.DirectionsRenderer();
		startLocation = new google.maps.LatLng(startLat, startLng);
  	mapOptions = {
    	zoom:3,
    	center: startLocation
  	}
  	map = new google.maps.Map(this.$el[0], mapOptions);
		
  	directionsDisplay.setMap(map);
  	directionsDisplay.setPanel(directionsDiv); 
  	this.calcRouteBiking()
  	this.setMarkers(map, mapPoints)

  	this.render()  	
	},
	render: function(){
		var googleMaps = this.$el.html( this.template() )
		$("div.container").append(googleMaps)

		console.log(googleMaps)
		$("div.container").append(directionsDiv)
	},
	createDirectionsPanel: function(){
		var div = $(document.createElement("div"))
		div.addClass("directions-panel col-xs-12 col-sm-12 col-md-4 col-lg-4")
		return div
	},
	calcRouteBiking: function() {
  request = {
    origin:"" + startLat +","+ startLng,
    destination:"" + endLat+","+endLng,
    travelMode: google.maps.TravelMode.BICYCLING
  };
  directionsService.route(request, function(result, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(result);
    	}
  	});
	},
	setMarkers: function(map, locations){
		var image = {
	    url: location.origin + "/assets/bike_for_map_small.png",
	    size: new google.maps.Size(30, 30),
	    origin: new google.maps.Point(0,0),
	    anchor: new google.maps.Point(15, 15)
  	};
  	var shape = {
      coords: [1, 1, 1, 30, 30, 30, 30 , 1],
      type: 'poly'
  	};
  	for (var i = 0; i < locations.length; i++) {
	    var content = contentString[i]
	    var station = locations[i];
	    var myLatLng = new google.maps.LatLng(station[1], station[2]);
	    var marker = new google.maps.Marker({
	        position: myLatLng,
	        map: map,
	        icon: image,
	        shape: shape,
	        title: station[0],
	        zIndex: station[3],
	    });
	  	this.setContent(content, marker)
		}
	},
	setContent: function(content, marker){
		google.maps.event.addListener(marker, 'click', function() {
			infowindow.setContent( content )
			infowindow.open(map,this);
		})
	}
})

var AllResults = Backbone.View.extend({
	tagName: "div",
	attributes: {
		class: "allResults col-xs-12 col-s-12 col-md-12 col-lg-12"
	},
	template: _.template($("#all-results").html() ),
	initialize: function(results){
		startLat = results.latLng.startLat;
		startLng = results.latLng.startLng;
		endLat = results.latLng.endLat;
		endLng = results.latLng.endLng;
		console.log(startLat)
		console.log(startLng)
		console.log(endLat)
		console.log(endLng)

		this.render()
	},
	render: function(){
		var allResults = this.$el.html( this.template() )
		$("div.container").empty()
		$("div.container").append(allResults)
	}
})




// parse params function
function parseParams(queryParams){
	attributes = []
	var split_amp = queryParams.split("&")
	for (var i = 0; i < split_amp.length; i++){
		mini_array = split_amp[i].split("=")
		attributes.push(mini_array)
	}
	var params = {}
	for (var j = 0; j < attributes.length; j++){
		params[attributes[j][0]] = attributes[j][1];
	}
	return params 
}

// Router
var Router = Backbone.Router.extend({
	routes: {
		"": "home",
		"search": "search",
		"searchResults": "searchResults", 
		"walking": "walking",
		"transit": "transit",
		"biking": "biking",
		"taxi": "taxi"
	}
})
var router = new Router;

router.on("route:home", function(){
	startEndPoints = new StartEndPoints
})

router.on("route:search", function(){

	var sendStartEndPoints = startEndPoints.getStartEndPoints()
	var gettingResults = new SpinningWheel
	$.ajax({
		type: "POST",
		url: "/route", 
		data: {
			startingPoint: sendStartEndPoints[0],
			endingPoint: sendStartEndPoints[1]
		}
	}).done(function(results){
		var location = new LocationView({ location_results: results.location })
		var weather = new WeatherView({ weather_results: results.weather, location_results: results.location })
		var walking = new WalkingView({ walking_results: results.walking, location_results: results.location })
		var biking = new BikingView({ biking_results: results.biking, location_results: results.location })
		var transit = new TransitView({ transit_results: results.transit, location_results: results.location })
		var taxi = new TaxiView({ taxi_results: results.taxi, location_results: results.location })
	})
})

router.on("route:walking", function(queryParams){
	params = parseParams(queryParams)
	var backButton = new AllResults ({ latLng:params })
	var walkingMap = new GoogleMapsView({ latLng:params, transitType:"WALKING" })
	
})

router.on("route:transit", function(queryParams){
	params = parseParams(queryParams)	
	var backButton = new AllResults ({ latLng:params })
	var walkingMap = new GoogleMapsView({ latLng:params, transitType:"TRANSIT" })
})

router.on("route:biking", function(queryParams){
	params = parseParams(queryParams)
	$.ajax({
		type: "POST",
		url: "/bikeStations", 
		data: {
			params: params
		}
	}).done(function(results){
		var backButton = new AllResults ({ latLng:params })
		var bikingMap = new GoogleMapsBikeView({ latLng:params, transitType:"BICYCLING", stations:results })
	})
})

router.on("route:taxi", function(queryParams){
	params = parseParams(queryParams)
	var backButton = new AllResults ({ latLng:params })
})

router.on("route:searchResults", function(queryParams){
	params = parseParams(queryParams)	
	$.ajax({
		type: "POST",
		url: "/route", 
		data: {
			startLat: params.startLat,
			startLng: params.startLng,
			endLat: params.endLat,
			endLng: params.endLng
		}
	}).done(function(results){
		var location = new LocationView({ location_results: results.location })
		var weather = new WeatherView({ weather_results: results.weather, location_results: results.location })
		var walking = new WalkingView({ walking_results: results.walking, location_results: results.location })
		var biking = new BikingView({ biking_results: results.biking, location_results: results.location })
		var transit = new TransitView({ transit_results: results.transit, location_results: results.location })
		var taxi = new TaxiView({ taxi_results: results.taxi, location_results: results.location })
	})
})

Backbone.history.start()
