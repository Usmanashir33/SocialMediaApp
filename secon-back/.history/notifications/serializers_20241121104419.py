from rest_framework.serializers import ModelSerializer
from .models import CommunityDelNotification,

class NotificationSerializer(ModelSerializer) :
    class Meta :
        model = CommunityDelNotification
        fields = "__all__"