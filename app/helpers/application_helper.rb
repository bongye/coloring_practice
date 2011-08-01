module ApplicationHelper
  def logo
    image_tag("logo.png", :alt => "Coloring Practice", :class => "round")
  end
  def title
    base_title = "Coloring Practice"
    if @title.nil?
      base_title
    else 
      "#{base_title} | #{@title}"
    end
  end
end
