from django.shortcuts import render
from .serializers import ProfileSerializer, UserSerializer
from rest_framework.views import APIView
from rest_framework import permissions
from rest_framework import status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser,FormParser
from.models import Profile
from .models import User
from django.db.models import Q
from livechatapp.models import Community
from livechatapp.serializers import CommunitiesSerializer
from notifications.models import FollowingNotification

classmethod