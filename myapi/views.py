from django.shortcuts import render,HttpResponse
from rest_framework import generics, status
from .serializers import RoomSerializer, CreateRoomSerializer, UpdateRoomSerializer
from .models import Room
from rest_framework.views import APIView
from rest_framework.response import Response
import random
import string
from django.http import JsonResponse

# Create your views here.
class RoomView(generics.CreateAPIView):
    queryset=Room.objects.all()
    serializer_class=RoomSerializer

class GetRoom(APIView):
    serializer_class=RoomSerializer
    lookup_url_kwarg='code'

    def get(self,request, format=None):
        code=request.GET.get(self.lookup_url_kwarg)
        if code:
            room=Room.objects.filter(code=code)
            if len(room)>0:
                data=RoomSerializer(room[0]).data
                data['is_host']=self.request.session.session_key == room[0].host
                return Response(data, status=status.HTTP_200_OK)
            return Response({'Room Not Found': 'Invalid Room Code.'}, status=status.HTTP_404_NOT_FOUND)

        return Response({'Bad Request': 'Code paramater not found in request'}, status=status.HTTP_400_BAD_REQUEST)

class CreateRoomView(APIView):
    serializer_class=CreateRoomSerializer
    def get(self, request, format=None):
        users = Room.objects.all()
        serializer = RoomSerializer(users, many=True)
        return Response(serializer.data)
    def post(self,request,format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        serializer=self.serializer_class(data=request.data)
        if serializer.is_valid():
            pause=serializer.data.get('pause')
            votes=serializer.data.get('votes')
            print(pause,votes)
            host=self.request.session.session_key
            queryset=Room.objects.filter(host=host)
            if queryset.exists():
                room=queryset[0]
                room.pause=pause
                room.votes=votes
                room.save(update_fields=['pause','votes'])
                self.request.session['room_code']=room.code
                return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)
                
            else:
                code=''.join(random.choices(string.ascii_uppercase,k=6))
                room=Room(code=code,host=host, pause=pause,votes=votes)
                self.request.session['room_code']=room.code
                room.save()
                return Response(RoomSerializer(room).data, status=status.HTTP_201_CREATED)
        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)


class JoinRoom(APIView):
    lookup_url_kwarg='code'
    def post(self,request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        code=request.data.get(self.lookup_url_kwarg)
        if code:
            room_result=Room.objects.filter(code=code)
            if len(room_result)>0:
                room=room_result[0]
                self.request.session['room_code']=code
                return Response({'message':'Room Joined'}, status=status.HTTP_200_OK)
            return Response({'Bad Request':'Invalid Code'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'Bad Request': 'Invalid post data, Did not find your code'}, status=status.HTTP_400_BAD_REQUEST)

class UserInRoom(APIView):
    def get(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        data = {
            'code': self.request.session.get('room_code')
        }
        return JsonResponse(data, status=status.HTTP_200_OK)

class LeaveRoom(APIView):
    def post(self, request, format=None):
        if 'room_code' in self.request.session:
            self.request.session.pop('room_code')
            host_id = self.request.session.session_key
            room_results = Room.objects.filter(host=host_id)
            if len(room_results) > 0:
                room = room_results[0]
                room.delete()

        return Response({'Message': 'Success'}, status=status.HTTP_200_OK)


class UpdateView(APIView):
    
    serializer_class=UpdateRoomSerializer
    def patch(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        
        serializer=self.serializer_class(data=request.data)
        if serializer.is_valid():
            pause=serializer.data.get('pause')
            votes=serializer.data.get('votes')
            code=serializer.data.get('code')
            queryset=Room.objects.filter(code=code)
            if not queryset.exists():
                return Response({'msg':'Room doesnt exist'}, status=status.HTTP_404_NOT_FOUND)
            room=queryset[0]
            user_id=self.request.session.session_key
            if room.host!=user_id:
                return Response({'msg':'No authority to do this tasl'}, status=status.HTTP_403_FORBIDDEN)
            room.pause=pause
            room.votes=votes
            print(pause,votes)
            room.save(update_fields=['pause','votes'])
            return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)
            
        return Response({'Bad Request':'Invalid Data'}, status=status.HTTP_400_BAD_REQUEST)