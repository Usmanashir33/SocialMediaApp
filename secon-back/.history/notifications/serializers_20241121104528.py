from rest_framework.serializers import ModelSerializer
from .models import CommunityDelNotification,FollowingNotification
fro
class NotificationSerializer(ModelSerializer) :
    class Meta :
        model = CommunityDelNotification
        fields = "__all__"
        
class FNotificationSerializer(ModelSerializer) :
    class Meta :
        model = FollowingNotification
        fields = "__all__"