class RouteController < ApplicationController

	def index

		# Starting Point lat / lngs 
		starting_point = params[:startingPoint]
		starting_encoded = starting_point.gsub(" ", "+")
		start_results = HTTParty.get("https://maps.googleapis.com/maps/api/geocode/json?address=#{starting_encoded}&key=AIzaSyAccMdPuDvaAGvXzwJemlq5ZNJjNxEvEec")
		if start_results["status"] != "OK" 
			render :text => "ERROR! Something wrong with your start location"
		end 
		start_name = start_results["results"][0]["formatted_address"]
		start_lat = start_results["results"][0]["geometry"]["location"]["lat"]
		start_lng = start_results["results"][0]["geometry"]["location"]["lng"]     


		# Ending Point lat /lngs
		ending_point = params[:endingPoint]
		ending_encoded = ending_point.gsub(" ", "+")
		end_results = HTTParty.get("https://maps.googleapis.com/maps/api/geocode/json?address=#{ending_encoded}&key=AIzaSyAccMdPuDvaAGvXzwJemlq5ZNJjNxEvEec")
		if end_results["status"] != "OK" 
			render :text => "ERROR! Something wrong with your end location"
		end 
		end_name = end_results["results"][0]["formatted_address"]
		end_lat = end_results["results"][0]["geometry"]["location"]["lat"] 
		end_lng = end_results["results"][0]["geometry"]["location"]["lng"]



		# weather API call based on lat /lgn
		weather = HTTParty.get("http://api.wunderground.com/api/d8beaac28d7f691e/conditions/q/#{end_lat},#{end_lng}.json")
		weather_conditions = weather["current_observation"]["weather"]  
		temp_f = weather["current_observation"]["temp_f"]  
		weather_icon = weather["current_observation"]["icon_url"] 


		# Walking distance 
		walking = HTTParty.get("https://maps.googleapis.com/maps/api/distancematrix/json?origins=#{start_lat},#{start_lng}&destinations=#{end_lat},#{end_lng}&mode=walking&departure_time=#{Time.now.to_i}&units=imperial")
		if walking["status"] != "OK"
			render :text => "An error has occured"
		end 
		walking_distance = walking["rows"][0]["elements"][0]["distance"]["text"]
		walking_time = walking["rows"][0]["elements"][0]["duration"]["text"]

		# Biking distance
		biking = HTTParty.get("https://maps.googleapis.com/maps/api/distancematrix/json?origins=#{start_lat},#{start_lng}&destinations=#{end_lat},#{end_lng}&mode=bicycling&departure_time=#{Time.now.to_i}&units=imperial")
		if walking["status"] != "OK"
			render :text => "An error has occured"
		end
		biking_distance = biking["rows"][0]["elements"][0]["distance"]["text"]
		biking_time = biking["rows"][0]["elements"][0]["duration"]["text"]


		# Transit directions
		transit = HTTParty.get("https://maps.googleapis.com/maps/api/directions/json?origin=#{start_lat},#{start_lng}&destination=#{end_lat},#{end_lng}&mode=transit&departure_time=#{Time.now.to_i}&units=imperial&key=AIzaSyAccMdPuDvaAGvXzwJemlq5ZNJjNxEvEec")
		transit_distance = transit["routes"][0]["legs"][0]["distance"]["text"]
		transit_duration = transit["routes"][0]["legs"][0]["duration"]["text"]
		if transit["routes"][0]["legs"][0]["steps"][1]["transit_details"]
			transit_icon = transit["routes"][0]["legs"][0]["steps"][1]["transit_details"]["line"]["vehicle"]["icon"]  
			else 
				transit_icon = ""
		end 
		if transit["routes"][0]["legs"][0]["steps"][1]["transit_details"]["line"]["icon"] 
			transit_route_icon = transit["routes"][0]["legs"][0]["steps"][1]["transit_details"]["line"]["icon"] 
		else 
			transit_route_icon = ""
		end 
		# uber taxi time and $ call
		uber = HTTParty.get("https://api.uber.com/v1/estimates/price?server_token=NE7mzs5jHPxZWhdfsTRVmHM0y5hlr2PA_SqTVTp_&start_latitude=#{start_lat}&start_longitude=#{start_lng}&end_latitude=#{end_lat}&end_longitude=#{end_lng}")
		if uber["code"] != nil
			render :text => "An error has occured"
		end 
		
		uberX_estimate = uber["prices"][0]["estimate"]  

results = {
	:location => {
		:start_location => start_name,
		:start_lat => start_lat, 
		:start_lng => start_lng,
		:end_location => end_name,
		:end_lat => end_lat,
		:end_lng => end_lng
	},
	:weather => {
		:icon => weather_icon,
		:temp => temp_f,
		:conditions => weather_conditions
	},
	:transit => {
		:transit_icon => transit_icon,
		:route_icon => transit_route_icon,
		:duration => transit_duration,
		:distance => transit_distance
	},
	:biking => {
		:distance => biking_distance,
		:time => biking_time,
		:calories => "figure this out!"
	},
	:walking => {
		:distance => walking_distance,
		:time => walking_time,
		:calories => "figure this out too!"
	},
	:taxi => {
		:price => uberX_estimate
	}
}


	render :json => results
	end 
end 