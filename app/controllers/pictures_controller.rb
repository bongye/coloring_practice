class PicturesController < ApplicationController
  before_filter :authenticate, :only => [:new, :create]
  before_filter :correct_user, :only => [:destroy]

  def new
    @picture = Picture.new
  end
  def show
    @picture = Picture.find(params[:id])
  end
  def create
    @picture = Picture.create(params[:picture])
    user = current_user;
    @picture.user = user;

    if @picture.save
      flash[:success] = "New picture saved successfully."
      redirect_to @picture
    else
      flash.now[:error] = "Error occured."
      render 'new'
    end
  end
  def destroy
    @picture = Picture.find(params[:id])
    user = @picture.user
    @picture.destroy
    redirect_to user
  end
end
