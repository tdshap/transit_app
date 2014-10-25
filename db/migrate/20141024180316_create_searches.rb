class CreateSearches < ActiveRecord::Migration
  def change
    create_table :searches do |t|
    	t.string :name
    	t.float :starting_point
    	t.float :ending_point
    	t.integer :user_id

    end
  end
end
