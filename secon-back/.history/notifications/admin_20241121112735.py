from django.contrib import admin
from .models import CommunityDelNotification,FollowingNotification

# Register your models here.
@admin.register(CommunityDelNotification)
class NotificationAdmin(admin.ModelAdmin):
    list_display =['message','created','deleter','name']
    
@admin.register(CommunityDelNotification)
class NotificationAdmin(admin.ModelAdmin):
    list_display =['message','created','deleter','name']
    

