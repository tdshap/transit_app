var UsersCollection = Backbone.Collection.extend({
	url: "/users"
})



var StartEndPoints = Backbone.View.extend({
	tagName: "div",
	template: _.template($("#start-end-points").html() ),
	events: {
		"click button.StartEnd" : "getStartEndPoints"
	},
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
		$.ajax({
			type: "POST",
			url: "http://127.0.0.1:3000/route", 
			data: {
				startingPoint: startingPoint,
				endingPoint: endingPoint
			}
		}).done(function(results){
			var location = new LocationView({ location_results: results.location })
			var weather = new WeatherView({ weather_results: results.weather, location_results: results.location })
			var walking = new WalkingView({ walking_results: results.walking, location_results: results.location })
			var transit = new TransitView({ transit_results: results.transit, location_results: results.location })
			var biking = new BikingView({ biking_results: results.biking, location_results: results.location })
			var taxi = new TaxiView({ taxi_results: results.taxi, location_results: results.location })
		})
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

var TaxiView = Backbone.View.extend({
	tagName: "div",
	attributes: {
		class: "taxi col-xs-12 col-s-12 col-md-12 col-lg-12"
	},
	template: _.template($("#taxi-view").html() ),
	initialize: function(results, location_results){
		price = results.taxi_results.price;
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

// js google maps script
// function loadScript() {
//   var script = document.createElement('script');
//   script.type = 'text/javascript';
//   script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&' +
//       'callback=initialize';
//   document.body.appendChild(script);
// };

// window.onload = loadScript;

var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var map;

var GoogleMapsView = Backbone.View.extend({
	tagName: "div",
	attributes: {
		id: "map-canvas"
	},
	template: _.template($("#google-maps-view").html() ),
	initialize: function(params){
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
  		this.calcRouteWalking()
  	} else if (transitType == "BICYCLING"){
  		this.calcRouteBiking()
  	} else if (transitType == "TRANSIT"){
  		this.calcRouteTransit()
  	}
	},
	render: function(){
		var googleMaps = this.$el.html( this.template() )
		$("div.container").empty()
		$("div.container").append(googleMaps)
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
		"walking": "walking",
		"transit": "transit",
		"biking": "biking",
		"taxi": "taxi"
	}
})
var router = new Router;

router.on("route:home", function(){
var startEndPoints = new StartEndPoints
})

router.on("route:walking", function(queryParams){
	
	params = parseParams(queryParams)
	var walkingMap = new GoogleMapsView({ latLng:params, transitType:"WALKING" })
	walkingMap.render()
})
router.on("route:transit", function(queryParams){
	params = parseParams(queryParams)
	var walkingMap = new GoogleMapsView({ latLng:params, transitType:"TRANSIT" })
	walkingMap.render()
})
router.on("route:biking", function(queryParams){
	params = parseParams(queryParams)
	var walkingMap = new GoogleMapsView({ latLng:params, transitType:"BICYCLING" })
	walkingMap.render()
})
router.on("route:taxi", function(queryParams){
	params = parseParams(queryParams)
	console.log("taxi router")
})


Backbone.history.start()
