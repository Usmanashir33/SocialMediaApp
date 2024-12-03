from django.shortcuts import render
from .serializers import ProfileSerializer, UserSerializer
from rest_framework.views import APIView
from rest_framework import permissions
from rest_framework import status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser,FormParser
import random

from .models import User
from django.db.models import Q
from .authSerializers import ChangePasswordSerializer

class VerifyAccountOwnerView(APIView):
    # we need email here 
    permission_classes=[permissions.AllowAny]
    def post(self, request,format=None):
        try :
            email = request.data.get('email')
            found = User.objects.filter(email=email)
            new_degit = random.randint(123456,987654)
             
            # send email here 
            return Response({"verified_ownership" : True } if found else {"error" : "No account associated with this email"}) # either true or false
        except :
            return Response({"error" :"something went wronge"})
        
class ChangePasswordView(APIView):
    # we need email here 
    permission_classes=[permissions.AllowAny]
    def post(self, request,format=None):
        try :
            serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
            if serializer.is_valid():
                user = request.user
                changed =  serializer.update(user, serializer.validated_data)
                return Response(changed, status=status.HTTP_200_OK)
        except :
            return Response({"error" :"something went wronge"})

# updating       
class VerifyOldPasswordView(APIView):
    def post(self, request,format=None):
        user = request.user
        old_password = request.data.get('old_password')
        correct = user.check_password(old_password)
        return Response({"verified" : correct} if correct else {"error" : "password not correct"}) # either true or false
    
class ChangeUserPasswordView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        
        if serializer.is_valid():
            user = request.user
            changed =  serializer.update(user, serializer.validated_data)
            return Response(changed, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)