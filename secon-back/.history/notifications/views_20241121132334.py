from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from.models import CommunityDelNotification
from .serializers import NotificationSerializer,FNotificationSerializer

# Create your views here.
class UserNotificationView(APIView): 
    def get(self, request):
        try:
            user = request.user
            com_notifications = user.comdelnot.all()
            follow_notifications = user.whofollow.all()
            serializer = NotificationSerializer(com_notifications,many=True)
            follow_serializer = NotificationSerializer(follow_notifications,many=True)
            return Response(serializer.data)
        except :
            return Response({"error" : "something went error"})
        
class UserReadNotificationView(APIView):
    def get(self, request):
        resp ={}
        try:
            user = request.user
            com_notifications = user.comdelnot.all()
            for notif in com_notifications :
                notif.readers.add(user) 
                resp ={'success' : 'viewed'}
            return Response(resp)
        except :
            return Response({"error" : "something went error"})
class UserDeleteNotificationView(APIView):
    def delete(self, request,notification_id):
        try:
            user = request.user
            com_notification = user.comdelnot.get(id = notification_id)
            com_notification.members.remove(user) 
            return Response({"success":"removed"})
        except :
            return Response({"error" : "something went error"})
