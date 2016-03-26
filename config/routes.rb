Rails.application.routes.draw do
  root "session#show"

  resources :users do 
    resources :searches
  end 
  post "/sessions" => "session#create"
  # get "/login" => "session#new"
  get "/signup" => "users#new"
  get "/signout" => "session#destroy"
  get "/signin" => "session#new"

  post "/route" => "route#index"
  post "bikeStations" => "route#bikeStations"


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



  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  # root 'welcome#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
