class Api::V1::GamesController < ApplicationController
    def create
        @game = Game.new(game_params)
    end

    private

    def game_params
        params.require(:game).permit(:user)
    end
end