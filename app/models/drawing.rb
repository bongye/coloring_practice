class Drawing < ActiveRecord::Base
  has_attached_file :image, :style => { :medium => "300x300>", :thumb => "100x100>" }

  belongs_to :user
  belongs_to :picture
end
