class Api::V1::UsersController < ApplicationController
    def create
        @user = User.new(user_params)
        redirect_to new_instructor_path
    end

    def show
        @user = User.find(params[:id])
        render json: @user
    end

    def update
        @user = User.find(params[:id])
        if @user.update(user_params)
            redirect_to @user
        else
            redirect_to edit_user_path
    end

    private

    def user_params
        params.require(:user).permit(:name)
    end
end