class SessionController < ApplicationController
	def new
		@user = User.find_by(id: session[:user_id])
		if @user
			redirect_to "/users/#{@user.id}"
		else
			render :new
		end 
	end 
	def create
		@user = User.find_by(email: params[:email])

		if @user && @user.authenticate(params[:password])
			session[:user_id] = @user.id
			redirect_to "/users/#{@user.id}"
		else 
			@error = true
			render :new
		end 
	end
	
	def destroy
		reset_session
		redirect_to "/"
	end 
end 