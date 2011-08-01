class CreateUsers < ActiveRecord::Migration
  def self.up
    create_table :users do |t|
      t.string :name
      t.string :email
      t.string :encrypted_password

      t.string :avatar_file_name
      t.string :avatar_content_type
      t.string :avatar_file_size
      t.datetime :avatar_updated_at
      t.timestamps
    end
    add_index :users, :email, :unique => true
  end

  def self.down
    drop_table :users
  end
end
