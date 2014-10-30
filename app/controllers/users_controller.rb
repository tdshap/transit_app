class UsersController < ApplicationController
	def index
		users = User.all
		render :json => users
	end 

	def create
		binding.pry
		user = User.create({
			user_name: params[:user_name],
			password: params[:password],
			email: params[:email]
			})
		@signed_up = true

		render "session/new"
	end 

	def new
		render :new
	end 
	
	# def edit
	# end 
	
	def show 
		@user = User.find(params[:id])
		render :index
	end 
	
	def	update
		user = User.find(params[:id])
		if params[:user_name]
			user.user_name = params[:user_name]
		end 
		if params[:email]
			user.email = params[:email]
		end 
		if params[:password]
			user.password = params[:password]
		end 
		user.save
		render :json => "User was updated"
	end

	def destroy
		user = User.find(params[:id])
		user.destroy
		render :json => "Username and Password were destroyed"
	end 
end 

#          Prefix Verb   URI Pattern                                 Controller#Action
#             root GET    /                                           root#index
#    user_searches GET    /users/:user_id/searches(.:format)          searches#index
#                  POST   /users/:user_id/searches(.:format)          searches#create
#  new_user_search GET    /users/:user_id/searches/new(.:format)      searches#new
# edit_user_search GET    /users/:user_id/searches/:id/edit(.:format) searches#edit
#      user_search GET    /users/:user_id/searches/:id(.:format)      searches#show
#                  PATCH  /users/:user_id/searches/:id(.:format)      searches#update
#                  PUT    /users/:user_id/searches/:id(.:format)      searches#update
#                  DELETE /users/:user_id/searches/:id(.:format)      searches#destroy
#            users GET    /users(.:format)                            users#index
#                  POST   /users(.:format)                            users#create
#         new_user GET    /users/new(.:format)                        users#new
#        edit_user GET    /users/:id/edit(.:format)                   users#edit
#             user GET    /users/:id(.:format)                        users#show
#                  PATCH  /users/:id(.:format)                        users#update
#                  PUT    /users/:id(.:format)                        users#update
#                  DELETE /users/:id(.:format)                        users#destroy