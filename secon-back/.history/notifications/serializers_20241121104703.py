from rest_framework.serializers import ModelSerializer
from .models import CommunityDelNotification,FollowingNotification
from accounts.serializers import MiniUserSerializer
class NotificationSerializer(ModelSerializer) :
    class Meta :
        model = CommunityDelNotification
        fields = "__all__"
        
class FNotificationSerializer(ModelSerializer) :
    follower = M
    class Meta :
        model = FollowingNotification
        fields = "__all__"