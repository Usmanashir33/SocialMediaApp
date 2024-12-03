from rest_framework.serializers import ModelSerializer
from .models import CommunityDelNotification,FollowingNotification

class NotificationSerializer(ModelSerializer) :
    class Meta :
        model = CommunityDelNotification
        fields = "__all__"
        
class NotificationSerializer(ModelSerializer) :
    class Meta :
        model = CommunityDelNotification
        fields = "__all__"