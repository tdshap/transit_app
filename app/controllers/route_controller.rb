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
		conditions = weather["current_observation"]["weather"]  
		temp_f = weather["current_observation"]["temp_f"]  
		icon = weather["current_observation"]["icon_url"] 


		# Walking distance 
		walking = HTTParty.get("https://maps.googleapis.com/maps/api/distancematrix/json?origins=#{start_lat},#{start_lng}&destinations=#{end_lat},#{end_lng}&mode=walking&departure_time=#{Time.now.to_i}&units=imperial")
		if walking["status"] != "OK"
			render :text => "An error has occured"
		end 
		walking_distance = walking["rows"][0]["elements"][0]["distance"]["text"]
		walking_time = walking["rows"][0]["elements"][0]["duration"]["text"]

		# Biking distance
		biking = HTTParty.get("https://maps.googleapis.com/maps/api/distancematrix/json?origins=#{start_lat},#{start_lng}&destinations=#{end_lat},#{end_lng}&mode=bicycling&departure_time=#{Time.now.to_i}&units=imperial")
		biking_distance = biking["rows"][0]["elements"][0]["distance"]["text"]
		biking_time = biking["rows"][0]["elements"][0]["duration"]["text"]
binding.pry

		# google maps transit directions call

			# encoding timestamp to seconds since 1970: Time.now.to_i
		


		# uber taxi time and $ call


	end 
end 