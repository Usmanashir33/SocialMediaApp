from rest_framework import serializers
from .models import Post,Comment
# from accounts.serializers import UserSerializer
# from django.contrib.auth.models import 
from accounts.models import User

class PosterSerializer(serializers.ModelSerializer):
    # file = serializers.FileField(required=False)
    class Meta:
        model =Post
        fields = ['id','body','user','file']
        # fields = "__all__"
        read_only_fields = ("id",)
        
class CommenterSerializer(serializers.ModelSerializer):
    class Meta:
        model =Comment
        fields = "__all__"
        read_only_fields = ("id",)
        
class MiniUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','username','first_name',"last_name",'date_joined']
        read_only_fields = ("id",)
        
class MiniCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model =Comment
        fields = ("id",'user',)
        
class MiniPostSerializer(serializers.ModelSerializer):
    class Meta:
        model =Post
        fields = ("id",'user',)


class PostSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()
    user = MiniUserSerializer(User) 
    postcomments = MiniCommentSerializer(Comment,many = True)
    class Meta:
        model =Post
        # fields = ['id','body','user']
        fields = "__all__"
        read_only_fields = ('user',)
    def get_file_url(self, obj):
        return obj.get_file_url()
        
class CommentSerializer(serializers.ModelSerializer):
    user = MiniUserSerializer(User)
    post= MiniPostSerializer(Post)
    replies = MiniCommentSerializer(Comment,many=True)
    class Meta:
        model =Comment
        fields = "__all__"
        