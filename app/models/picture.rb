class Picture < ActiveRecord::Base
  has_attached_file :image, :styles => { :medium => "300x300>", :thumb => "100x100>" }
  
  has_many :drawings
  belongs_to :user
end
