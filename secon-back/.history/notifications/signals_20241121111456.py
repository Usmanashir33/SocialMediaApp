from django.db.models.signals import post_save, post_delete,pre_delete,pre_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from accounts.models import User
from .serializers import NotificationSerializer,FNotificationSerializer
from livechatapp.models import Community
from .models import CommunityDelNotification,FollowingNotification  # Import any models you want to listen to

# @receiver(post_save, sender=User)
# def notify_on_save(sender, instance, created, **kwargs):
#     if created:
#         message = f"A new entry '{instance.name}' was added."
#     else:
#         message = f"The entry '{instance.name}' was updated."
    
#     # Example: Notify the user who created the instance
#     # CommunityDelNotification.objects.create(user=instance.owner, message=message)

@receiver(pre_delete, sender=Community)
def notify_on_delete(sender, instance, **kwargs):
    users = instance.members.all() 
    # print(instance.members.all())
    message = f"The '{instance.name}' community was deleted by {instance.creator.username}."
    notification = CommunityDelNotification.objects.create(
        message = message,
        status = "success",
        deleter = instance.creator.username,
        name = instance.name,
        action = "deleting"
    )
    for user in users:
        if user not in notification.members.all():
            notification.members.add(user)
            
    notify_community_members(notification)

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
def notify_community_members(notification):
    channel_layer = get_channel_layer()
    response = NotificationSerializer(notification).data 
    response["type"] = "user_notification"
    for user in notification.members.all() :
        async_to_sync(channel_layer.group_send)(
            f"notification_user_{user.id}", response
        )
        
@receiver(post_save, sender=FollowingNotification)
def notify_on_delete(sender, instance, **kwargs):
   friend = instance.following.id
   response = FNotificationSerializer(instaan)