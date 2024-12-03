from rest_framework import serializers
from accounts.models import User,Profile
from .models import Message,CommunityChat,Community
from posts.serializers import MiniUserSerializer

class ChatFriendSerializer(serializers.ModelSerializer):
    last_message = serializers.CharField(read_only = True)
    unread_chats = serializers.IntegerField(read_only = True)
    last_message_date = serializers.DateTimeField(read_only = True)
    class Meta :
        model = User
        fields =["id","first_name","last_name",'picture',"username","last_message","last_message_date","unread_chats"]

class CommunitiesSerializer(serializers.ModelSerializer):
    last_message = serializers.CharField(read_only = True)
    last_message2 = serializers.CharField(read_only = True)
    last_message_sender = serializers.IntegerField(read_only = True) 
    
    creator = MiniUserSerializer(User)
    class Meta :
        model = Community
        fields =["id","name","date",'creator','members','picture',"last_message","last_message_sender"]

class ChatSerializer(serializers.ModelSerializer):
    user_from = MiniUserSerializer(User)
    class Meta :
        model = CommunityChat
        fields =["id","message","user_from","date","chat_community",'media']
        read_only_fields = ("chat_community",)

    
class CommunityChatSerializer(serializers.ModelSerializer):
    chats = serializers.SerializerMethodField()
    class Meta :
        model = Community
        fields = ["id","name",'picture',"date",'creator','only_admin_chat','chats','members','admins']
        read_only_fields = ("id",)
        
    def get_chats(self,obj):
        messages = self.context.get("chats",[])
        return ChatSerializer(messages,many=True).data

class MessageSerializer(serializers.ModelSerializer):
    user_from = MiniUserSerializer(User)
    class Meta:
        model = Message
        fields = "__all__"
class SaveMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = "__all__"
        
class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['title','address']
    
class FriendChatsSerializer(serializers.ModelSerializer):
    chats = serializers.SerializerMethodField()
    profile = serializers.SerializerMethodField()
    class Meta :
        model = User
        fields = ['id',"username",'last_name','picture','first_name','chats','profile']
        
    def get_chats(self,obj):
        messages = self.context.get("chats",[])
        return MessageSerializer(messages,many=True).data
    
    def get_profile(self,obj):
        profile = self.context.get("profile",[])
        return ProfileSerializer(profile).data
    