from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Message,CommunityChat,Community
from accounts.models import User
from accounts.serializers import UserSerializer as MemberSerializer

import json

from django.db.models import Q,Subquery,OuterRef
from .serializers import ChatFriendSerializer ,FriendChatsSerializer,MessageSerializer
from .serializers import ChatFriendSerializer ,CommunitiesSerializer,CommunityChatSerializer
# Create your views here.

class AllChats(APIView):
    def get(self, request, format=None):
        try:
            user = request.user
            chats = Message.objects.filter(Q(user_from=user.id,user_to = OuterRef("id")) |
                                           Q(user_to = user.id,user_from = OuterRef("id")))
            unread_chats = Message.objects.filter(user_to=user.id).filter(user_from = OuterRef("id")).filter(read=True)
            # print("ikon Allah",unread_chats)
            
            chatfriends = User.objects.filter(
                Q(id__in = Subquery(chats.values_list("user_from",flat=True))) |
                Q(id__in = Subquery(chats.values_list("user_to",flat=True)))
            ).annotate(
                last_message = Subquery(chats.values("message").order_by("-date")[:1]),
                last_message_date = Subquery(chats.values("date").order_by("-date")[:1]),
                unread_chats = Subquery(chats.v.filter()),
                
            ).order_by(
                "-last_message_date"
            )
            serializer =  ChatFriendSerializer(chatfriends,many=True) 
            print(serializer.data)
            return Response(serializer.data) 
        
        except :
            return Response({"error":"something went wronge"}) 

class UnreadChats(APIView):
    def get(self, request, user_id, format=None): 
        try:
            user = request.user
            friend = User.objects.get(id = user_id)
            profile = friend.profile
            chats = Message.objects.filter(
                Q(user_from=user.id,user_to = user_id) |
                Q(user_to = user.id,user_from = user_id)
            ).order_by("date")
            serializer =  FriendChatsSerializer(friend, context={"chats" : chats,"profile" :profile}) 
            return Response(serializer.data) 
        except :
            return Response({"error":"something went wronge"}) 
        
class GetUserMessages(APIView):
    def get(self, request, user_id, format=None): 
        try:
            user = request.user
            friend = User.objects.get(id = user_id)
            profile = friend.profile
            chats = Message.objects.filter(
                Q(user_from=user.id,user_to = user_id) |
                Q(user_to = user.id,user_from = user_id)
            ).order_by("date")
            serializer =  FriendChatsSerializer(friend, context={"chats" : chats,"profile" :profile}) 
            return Response(serializer.data) 
        except :
            return Response({"error":"something went wronge"}) 
        
    def post(self, request, user_id, format=None): 
        try:
            user = request.user
            # friend = User.objects.get(id = user_id)
            message = request.data['message']
            data = {
                "message" : message,
                "user_from" : user.id,
                "user_to" : user_id
            }
            message_serializer = MessageSerializer(data=data)
            if message_serializer.is_valid():
                message_serializer.save()
                return Response(message_serializer.data) 
            return Response(message_serializer.errors) 
        except :
            return Response({"error":"something went wronge"}) 
class GetAllCommunities(APIView):
    def get(self, request, format=None):
        user = request.user
        try :
            if user :
                community_chats = CommunityChat.objects.filter(chat_community = OuterRef("id")).order_by("-date")
                communities = Community.objects.filter(members=user).annotate(
                    last_message = Subquery(community_chats.values("message")[:1]),
                    # last_message_sender = User.objects.get(id = Subquery(community_chats.values("user_from")[:1])),
                    last_message_sender = Subquery(community_chats.values("user_from")[:1]),
                    last_message_date = Subquery(community_chats.values("date")[:1]),
                    
                ).order_by(
                    "-last_message_date"
                )
                serializer = CommunitiesSerializer(communities,many=True)
                return Response(serializer.data)
            else :
                return Response({'error':"Login to connect"})
        except :
            return Response({'error':"something went wrong"}) 
class CommunityData(APIView):
    def get(self, request, community_id, format=None): 
        try:
            user = request.user
            community = Community.objects.get(id = community_id)
            if user in community.members.all():
                # let him see chats
                chats = community.chats.order_by("date")
                serializer = CommunityChatSerializer(community,context ={"chats":chats})
                return Response(serializer.data) 
            else :
                return Response({"error" : "Sorry you cant see this messages"})
        except :
            return Response({"error":"something went wronge"}) 
    def put(self, request, community_id, format=None): 
        try:
            user = request.user
            community = Community.objects.get(id = community_id)
            updated_name = request.data['name']
            if user in community.admins.all():
                # let him see chats
                community.name=updated_name
                community.save()
                serializer = CommunityChatSerializer(community)
                return Response(serializer.data) 
            else :
                return Response({"error" : "Sorry you cant edit "})
        except :
            return Response({"error":"something went wronge"}) 
    def delete(self, request, community_id, format=None): 
        # try:
            user = request.user
            community = Community.objects.get(id = community_id)
            if user == community.creator : # creator can delete the group
                community.delete()
                return Response({"deleted" :"deleted"}) 
            else :
                return Response({"error" : "Sorry you cant delete"})
        # except :
            # return Response({"error":"something went wronge in delete"}) 

class CommunityExit(APIView):
    # exiting the communities
    def get(self, request, community_id, format=None): 
        try:
            user = request.user
            community = Community.objects.get(id = community_id)
            if user in community.members.all() and user != community.creator: #user found in the community
                # let him see chats
                community.members.remove(user)
                return Response({"success" : "removed"} ) 
            else :
                return Response({"error" : "Sorry you cant exit "})
        except :
            return Response({"error":"something went wronge"}) 
class JoinCommunityView(APIView):
    # exiting the communities
    def get(self, request, community_id, format=None): 
        try:
            user = request.user
            community = Community.objects.get(id = community_id)
            if user not in community.members.all(): #user found in the community
                # let him see chats
                community.members.add(user)
                return Response({"success" : "added"} ) 
            else :
                return Response({"error" : "Sorry you join the community now"})
        except :
            return Response({"error":"something went wronge"}) 
        
class AddorRemoveMember(APIView):
    # exiting the communities
    def post(self, request, community_id, format=None): 
        resp = {}
        try:
            user = request.user
            community = Community.objects.get(id = community_id)
            friend_ids= request.data['friends']
            if user in community.admins.all():
                for id in friend_ids :
                    friend = User.objects.get(id = id)
                    if friend and friend.id is not community.creator.id :
                        if friend not in community.members.all(): #user admin in the community
                            community.members.add(friend)
                            resp = {"success" : "added"} 
                        else:
                            community.members.remove(friend)
                            resp = {"success" : "removed"}
                    else :
                        return Response({"error":"admin cannot be removed "})
                return Response(resp)
            else :
                return Response({"error" : "Sorry you cant perform this action"})
        except :
            return Response({"error":"something went wronge"}) 
        
class SetOnlyAdminView(APIView):
    # exiting the communities
    def get(self, request, community_id, format=None): 
        try:
            user = request.user
            community = Community.objects.get(id = community_id)
            if user in community.admins.all(): #user found in the community
                # let him see chats
                community.only_admin_chat = not community.only_admin_chat
                community.save()
                # community.only_admin_chat = True
                return Response({"success" : "success"} ) 
            else :
                return Response({"error" : "Sorry you cant perform such action"})
        except :
            return Response({"error":"something went wronge"}) 

class CommunityView(APIView) :
    def post(self, request, format=None):
        try :
            new_community = Community.objects.create(
                name = request.data['name'],
                creator = request.user
            )
            new_community.members.add(request.user)
            new_community.admins.add(request.user)
            serializer = CommunitiesSerializer(new_community)
            return Response(serializer.data)
        except :
            pass
class CommunityMembersView(APIView) :
    def get(self, request, community_id ,format=None):
        try :
            community = Community.objects.get(id = community_id)
            members = community.members if community else None
            serializer = MemberSerializer(members,many=True)
            return Response(serializer.data)
        except :
            return Response({"error" :"something went Wrong"})