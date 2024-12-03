from rest_framework.serializers import ModelSerializer
from posts.models import Post,Comment 
from .models import Profile,User

class MiniCommentSerializer(ModelSerializer):
    class Meta:
        model =Comment
        fields = ("id",)
        
class MiniPostSerializer(ModelSerializer):
    class Meta:
        model =Post
        fields = ("id",)
        
class ProfileSerializer(ModelSerializer):
    # user = UserSerializer(User)
    class Meta:
        model = Profile
        fields = "__all__"
        
class MiniUserSerializer(ModelSerializer):
    class Meta :
        model = User
        fields =['id','username',"email",'picture','first_name',]
class UserSerializer(ModelSerializer):
    profile = ProfileSerializer(Profile)
    userposts = MiniPostSerializer(Post,many=True)
    usercomments = MiniCommentSerializer(Comment,many=True)
    followings = MiniUserSerializer(User,many=True)
    class Meta:
        model = User
        fields = "__all__"
        extra_kwargs = {"password":{"write_only":True}}
        
