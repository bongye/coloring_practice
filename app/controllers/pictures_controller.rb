class PicturesController < ApplicationController
  def new
    @picture = Picture.new
  end
  def show
    @picture = Picture.find(params[:id])
  end
  def create
    @picture = Picture.create(params[:picture])
    if @picture.save
      flash[:success] = "New picture saved successfully."
      redirect_to @picture
    else
      flash.now[:error] = "Error occured."
      render 'new'
    end
  end
  
end
