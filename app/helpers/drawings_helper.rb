#coding: utf-8
module DrawingsHelper
  def is_drawer?(drawing, user)
    !user.nil? && drawing.user_id == user.id
  end

  def drawing_delete_link(drawing)
    link_to('삭제', "pictures/#{drawing.picture.id}/drawings/#{drawing.id}", :method => :delete, :confirm => '정말 삭제하시겠습니까?')
  end

  def drawing_edit_link(drawing)
    link_to('수정', edit_picture_drawing_path(drawing.picture, drawing))
  end
end
