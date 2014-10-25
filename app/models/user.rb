class User < ActiveRecord::Base
	has_secure_password
	validates :user_name, :email, :password, presence: true
	has_many :searches
end 