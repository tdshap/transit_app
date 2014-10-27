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
			},
		}).done(function(results){
			var location = new LocationView({ location_results: results })
			// location.render()
			var weather = new WeatherView({ weather_results: results })
			weather.render()
			var walking = new WalkingView({ walking_results: results })
			walking.render()
			var transit = new TransitView({ transit_results: results })
			transit.render()
			var biking = new BikingView({ biking_results: results })
			biking.render()
			var taxi = new TaxiView({ taxi_results: results })
			taxi.render()
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
		start_location = results.location_results.location.start_location,
		end_location = results.location_results.location.end_location,
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
		conditions = results.weather_results.weather.conditions,
		temp = results.weather_results.weather.temp,
		icon = results.weather_results.weather.icon
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
	initialize: function(results){
		distance = results.walking_results.walking.distance,
		time = results.walking_results.walking.time, 
		calories = results.walking_results.walking.calories
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
	initialize: function(results){
		transit_icon = results.transit_results.transit.transit_icon,
		route_icon = results.transit_results.transit.route_icon,
		duration = results.transit_results.transit.duration,
		distance = results.transit_results.transit.distance
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
	initialize: function(results){
		distance = results.biking_results.biking.distance,
		time = results.biking_results.biking.time,
		calories = results.biking_results.biking.calories
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
	initialize: function(results){
		price = results.taxi_results.taxi.price
	},
	render: function(){
		var taxiView = this.$el.html( this.template() )
		$("div.container").append(taxiView)
	}
})

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

router.on("route:walking", function(){
	console.log("walking router")
})

router.on("route:transit", function(){
	console.log("walking router")
})
router.on("route:biking", function(){
	console.log("walking router")
})
router.on("route:taxi", function(){
	console.log("walking router")
})


Backbone.history.start();