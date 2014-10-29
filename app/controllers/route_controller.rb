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

		calculation = (walking_distance.split(" mi")[0]).to_f
		walking_calories  = (96 * calculation).to_i.to_s + " cals"

		# Biking distance
		biking = HTTParty.get("https://maps.googleapis.com/maps/api/distancematrix/json?origins=#{start_lat},#{start_lng}&destinations=#{end_lat},#{end_lng}&mode=bicycling&departure_time=#{Time.now.to_i}&units=imperial")
		if walking["status"] != "OK"
			render :text => "An error has occured"
		end
		biking_distance = biking["rows"][0]["elements"][0]["distance"]["text"]
		biking_time = biking["rows"][0]["elements"][0]["duration"]["text"]

		calculation = (biking_distance.split(" mi")[0]).to_f 
		biking_calories = (46 * calculation).to_i.to_s + " cals"



		# Transit directions
		transit = HTTParty.get("https://maps.googleapis.com/maps/api/directions/json?origin=#{start_lat},#{start_lng}&destination=#{end_lat},#{end_lng}&mode=transit&departure_time=#{Time.now.to_i}&units=imperial&key=AIzaSyAccMdPuDvaAGvXzwJemlq5ZNJjNxEvEec")
		transit_distance = transit["routes"][0]["legs"][0]["distance"]["text"]
		transit_duration = transit["routes"][0]["legs"][0]["duration"]["text"]
		if transit["routes"][0]["legs"][0]["steps"][1]["transit_details"]
			transit_icon = transit["routes"][0]["legs"][0]["steps"][1]["transit_details"]["line"]["vehicle"]["icon"]  
		else 
			transit_icon = ""
		end 
		if transit["routes"][0]["legs"][0]["steps"][1]["transit_details"] && transit["routes"][0]["legs"][0]["steps"][1]["transit_details"]["line"]["icon"] 
			transit_route_icon = transit["routes"][0]["legs"][0]["steps"][1]["transit_details"]["line"]["icon"] 
		else 
			transit_route_icon = ""
		end 

		# uber taxi price
		uber = HTTParty.get("https://api.uber.com/v1/estimates/price?server_token=NE7mzs5jHPxZWhdfsTRVmHM0y5hlr2PA_SqTVTp_&start_latitude=#{start_lat}&start_longitude=#{start_lng}&end_latitude=#{end_lat}&end_longitude=#{end_lng}")
		if uber["code"] != nil
			uberX_estimate = uber["code"]
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
				:calories => biking_calories
			},
			:walking => {
				:distance => walking_distance,
				:time => walking_time,
				:calories => walking_calories
			},
			:taxi => {
				:price => uberX_estimate
			}
		}
		render :json => results
	end 


	def bikeStations
		
		# Citibike stations within 0.003 degrees of origin
		stations = HTTParty.get("http://www.citibikenyc.com/stations/json")
 		
 		start_lat = params["params"]["startLat"].to_f
 		start_lng = params["params"]["startLng"].to_f
 		end_lat = params["params"]["endLat"].to_f
 		end_lng = params["params"]["endLng"].to_f

		start_stations = []
		end_stations = []

		stations["stationBeanList"].each do |station|
			start_lat_dif_sq = (station["latitude"] - start_lat) ** 2 
			start_lng_dif_sq = (station["longitude"] - start_lng) ** 2
			
			if 0.003 >= Math.sqrt(start_lat_dif_sq + start_lng_dif_sq)
				start_stations << station
			end 
			
			end_lat_dif_sq = (station["latitude"] - end_lat) ** 2
			end_lng_dif_sq = (station["longitude"] - end_lng) ** 2
			
			if 0.003 >= Math.sqrt(end_lat_dif_sq + end_lng_dif_sq)
				end_stations << station
			end 
		end 

		citibike = {}
		start_stations.each do |station|
			citibike[station["stationName"].to_sym] = []
			citibike[station["stationName"].to_sym].push({
				name: station["stationName"],
				lat: station["latitude"],
				lng: station["longitude"],
				bikes: station["availableBikes"]
			})
		end 

		end_stations.each do |station|
			citibike[station["stationName"].to_sym] = []
			citibike[station["stationName"].to_sym].push({
				name: station["stationName"],
				lat: station["latitude"],
				lng: station["longitude"],
				docks: station["availableDocks"]			
			})
		end 

		render :json => citibike
	end 

end 