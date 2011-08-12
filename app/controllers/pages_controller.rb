class PagesController < ApplicationController
  def home
    @title = "Home"

    @recent_pictures = Picture.order('updated_at').limit(5)
    @recent_drawings = Drawing.order('updated_at').limit(5)
  end
  def contact
    @title = "Contact"
  end
  def about
    @title = "About"
  end
  def help
    @title = "Help"
  end
end
