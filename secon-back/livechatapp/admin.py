from django.contrib import admin
from .models import Message,CommunityChat,Community
# Register your models here.
@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display=['message','user_to','user_from','read']
    
@admin.register(Community)
class CommunityAdmin(admin.ModelAdmin):
    list_display=['name','creator',"only_admin_chat",'total_members',"total_admins",'date']
@admin.register(CommunityChat)
class CommunityChatAdmin(admin.ModelAdmin):
    list_display=['message','user_from','to','date']

