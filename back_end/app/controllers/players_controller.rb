class PlayersController < ApplicationController
  def index 
    players = Player.all 
    render json: players 
  end 
  
  def show 
    player = Player.find(params[:id])
    render json: player
  end 

  def create
    player = Player.create(player_params)
    render json: player
  end

  private 
    def player_params 
      params.require(:player).permit(:player_name,:age)
    end 
end
