from rest_framework.serializers import ModelSerializer
from .models import CommunityDelNotification,F

class NotificationSerializer(ModelSerializer) :
    class Meta :
        model = CommunityDelNotification
        fields = "__all__"