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
    def get(self, request,format=None):
        user = request.user
        old_password = request.data.get('old_password')
        user.
        return Response({"old_passowrd" : old_password})