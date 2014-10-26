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
		StartEnd = this.$el.html(this.template)
		$("div.container").append(StartEnd)
	},
	getStartEndPoints: function(){
		startingPoint = $("input.start").val()
		endingPoint = $("input.end").val()
debugger
		$.ajax({
			type: "POST",
			url: "http://127.0.0.1:3000/route", 
			data: {
				startingPoint: startingPoint,
				endingPoint: endingPoint
			}
		}).done
	}
})

// Router
var Router = Backbone.Router.extend({
	routes: {
		"": "home",
		// "/transitOptions": ""
	}
})
var router = new Router;
	router.on("route:home", function(){
	var startEndPoints = new StartEndPoints
	
})


Backbone.history.start();