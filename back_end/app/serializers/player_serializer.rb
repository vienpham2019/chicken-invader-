class PlayerSerializer < ActiveModel::Serializer
  attributes :id , :player_name , :age

  has_many :games 
end
