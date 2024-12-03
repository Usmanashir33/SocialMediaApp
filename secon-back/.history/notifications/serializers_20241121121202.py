from rest_framework.serializers import ModelSerializer
from .models import CommunityDelNotification,FollowingNotification
from accounts.serializers import MiniUserSerializer
from accounts.models import User

class NotificationSerializer(ModelSerializer) :
    class Meta :
        model = CommunityDelNotification
        fields = "__all__"
        
class FNotificationSerializer(ModelSerializer) :
    follower = MiniUserSerializer(User)
    following = MiniUserSerializer(User)
    reade = MiniUserSerializer(User,many=True)
    
    class Meta :
        model = FollowingNotification
        fields = ['status',"following",'follower','date','readers']