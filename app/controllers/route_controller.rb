class RouteController < ApplicationController

	def index
		# Getting start & end lat / lngs 
		starting_point = params[:startingPoint]
		starting_encoded = starting_point.gsub(" ", "+")
		start_results = HTTParty.get("https://maps.googleapis.com/maps/api/geocode/json?address=#{starting_encoded}&key=AIzaSyAccMdPuDvaAGvXzwJemlq5ZNJjNxEvEec")
		if start_results["status"] != "OK" 
			render :text "ERROR! Something wrong with your start location"
		end 
		start_name = start_results["results"][0]["formatted_address"]
		start_lat = results["results"][0]["geometry"]["location"]["lat"]
		start_lng = results["results"][0]["geometry"]["location"]["lng"]     


		ending_point = param[:endingPoint]
		ending_encoded = ending_point.gsub(" ", "+")
		end_results = HTTParty.get("https://maps.googleapis.com/maps/api/geocode/json?address=#{ending_encoded}&key=AIzaSyAccMdPuDvaAGvXzwJemlq5ZNJjNxEvEec")
		if end_results["status"] != "OK" 
			render :text "ERROR! Something wrong with your end location"
		end 
		end_name = end_results["results"][0]["formatted_address"]
		end_lat = results["results"][0]["geometry"]["location"]["lat"] 
		end_lng = results["results"][0]["geometry"]["location"]["lng"]


		# weather API call based on lat /lgn

		weather = HTTParty.get("http://api.wunderground.com/api/d8beaac28d7f691e/conditions/q/#{end_lat},#{end_lgn}.json")

		conditions = weather["current_observation"]["weather"]  
		temp_f = weather["current_observation"]["temp_f"]  
		icon = weather["current_observation"]["icon_url"] 
	end 
end 