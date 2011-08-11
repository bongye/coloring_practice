class DrawingsController < ApplicationController
  before_filter :prepare_picture
  before_filter :authenticate, :only => [:new, :edit, :create, :update]

  def show
    @drawing = Drawing.find(params[:id])
  end
  def new
    @drawing = Drawing.new
  end
  def create
    @drawing = Drawing.new
    @drawing.picture = @picture
    @drawing.user = current_user
    @drawing.log = params[:log]
  
    save_canvas_image(@drawing, params[:image_data])
  end
  def edit
    @drawing = Drawing.find(params[:id])
  end
  def update
    @drawing = Drawing.find(params[:id])
    @drawing.log = params[:log]
    save_canvas_image(@drawing, params[:image_data])
    render 'create'
  end
  def destroy
    @drawing = Drawing.find(params[:id])
    @drawing.destroy
    redirect_to picture_drawings_path(@picture)
  end

  private 
    def prepare_picture
      @picture = Picture.find(params[:picture_id])
    end
    def save_canvas_image(drawing, image_data)
      file_name = Digest::SHA1.hexdigest(Time.now.to_s)
      file_ext = 'png';
      tmp_file = "#{Rails.root}/tmp/#{file_name}.#{file_ext}";
      id = 0;
      while File.exists?(tmp_file) do
        tmp_file = "#{Rails.root}/tmp/#{file_name}-#{id}.#{file_ext}";
        id += 1
      end

      File.open(tmp_file, 'wb') do |f|
        f.write(Base64.decode64(image_data))
      end
      drawing.image = File.open(tmp_file) 
      drawing.save
      drawing.image.reprocess!
      File.delete(tmp_file)
    end
end
