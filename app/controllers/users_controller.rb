class UsersController < ApplicationController
  before_filter :authenticate, :only => [:edit, :update]
  before_filter :correct_user, :only => [:edit, :update]
  def create
    @user = User.create(params[:user])
    if @user.save
      sign_in @user
      flash[:success] = "Welcome to the Coloring Practice!"
      redirect_to @user
    else 
      flash.now[:error] = "Error occured"
      render 'new'
    end
  end
  def show
    @user = User.find(params[:id])
  end
  def new
    @user = User.new
  end
  def edit
    @user = User.find(params[:id])
  end
  def update
    @user = User.find(params[:id]) 
    if @user.update_attributes(params[:user])
      flash[:success] = "Profile updated."
      redirect_to @user
    else
      render 'edit'
    end
  end
end
