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
            follow_serializer = FNotificationSerializer(follow_notifications,many=True)
            return Response({
                'com_deletion':serializer.data,
                'following': follow_serializer.data
            })
        except :
            return Response({"error" : "something went error in notifi"})
        
class UserReadNotificationView(APIView):
    def get(self, request):
        resp ={}
        try:
            user = request.user
            com_notifications = user.comdelnot.all()
            fol_notifications = user.followingNotif.exclude(members = use)
            total_notif = list(fol_notifications) + list(com_notifications)
            for notif in total_notif :
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
class UserDeleteFNotificationView(APIView):
    def delete(self, request,notification_id):
        # try:
            user = request.user
            fol_notification = user.whofollow.get(id = notification_id)
            fol_notification.members.remove(user) 
            # fol_notification.delete() 
            return Response({"success":"removed"})
        # except :
            # return Response({"error" : "something went error"})
