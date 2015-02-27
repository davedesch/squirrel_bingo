class CreateBingoCells < ActiveRecord::Migration
  def change
    create_table :bingocells do |t|
      t.string :bingocell

      t.timestamps
    end
  end
end
