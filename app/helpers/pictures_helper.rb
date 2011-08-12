#coding: utf-8
module PicturesHelper
  def is_uploader?(picture, user)
    !user.nil? && picture.user_id == user.id
  end
  
  def picture_delete_link(picture)
    link_to('삭제', picture_path(picture), :method => :delete, :confirm => '정말 삭제하시겠습니까?');
  end
end
