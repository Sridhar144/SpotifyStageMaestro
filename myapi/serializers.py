from .models import Room
from rest_framework import serializers
class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model=Room
        fields=('id','code',
'host',
'pause',
'votes',
'creation')
class CreateRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model=Room
        fields=('pause', 'votes')

class UpdateRoomSerializer(serializers.ModelSerializer):
    code=serializers.CharField(validators=[])
    class Meta:
        model=Room
        fields=('pause', 'votes', 'code')