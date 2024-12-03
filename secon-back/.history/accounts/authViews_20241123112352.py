from django.shortcuts import render
from .serializers import ProfileSerializer, UserSerializer
from rest_framework.views import APIView
from rest_framework import permissions
from rest_framework import status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser,FormParser

from .models import User
from django.db.models import Q

class VerifyOldPasswordView(APIView):
    print("hi")
    # def get(self, request,format=None):
    #     user = request.user
    #     # old_password = request.data.get('old_password')
    #     return Response({"old_passowrd" : "old_password"})
    def get(self, request, user_id,format=None):
        try :
            likesData = User.objects.get(id =user_id).userpostlikes.order_by('-date')
            if likesData :
                # serializer = PostSerializer(likesData ,many=True)
                return Response({"serializer.data":"tt"})
            else :
                return Response({"error":"Likes posts  not found"})
        except:
            return Response({"error":"failed to fetch the comments"})