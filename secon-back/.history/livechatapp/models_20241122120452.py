from django.db import models
from django.utils.translation import gettext_lazy as _
from accounts.models import User
import os 
def message_file_location(instance,filename) :
    ext = os.path.splitext(filename)[1]
    name = f"{instance.user_from.username}_file{ext}"
    return os.path.join("livechat/dm/",name)
def community_file_location(instance,filename) :
    ext = os.path.splitext(filename)[1]
    name = f"{instance.user_from.username}_Com_file{ext}"
    return os.path.join("community/messages/",name)
def community_name_file_location(instance,filename) :
    ext = os.path.splitext(filename)[1]
    name = f"{instance.name}_picture{ext}"
    return os.path.join("community/icons/",name)
    
# Create your models here.
class Message(models.Model):
    user_from = models.ForeignKey(User, verbose_name=_("From"),related_name="fromme", on_delete=models.DO_NOTHING)
    user_to = models.ForeignKey(User, verbose_name=_("To"),related_name="tome", on_delete=models.DO_NOTHING)
    message = models.TextField(_("Message"),blank=True,null=True)
    delete_for_me = models.ManyToManyField(User, verbose_name=_("delete for me"),blank=True)
    # delete_for_all = models.BooleanField(_("delete for all"),default=False)
    media = models.FileField(_("Media"), upload_to=message_file_location,blank=True,null=True)
    date = models.DateTimeField(_("Message_date"), auto_now_add=True,,blank=True,null=True)
    read = models.BooleanField(_("Read"),default=False)

    def __str__(self):
        return self.message[:30]
    
    class Meta:
        ordering = ("-date",)
        
class CommunityChat(models.Model):
    user_from = models.ForeignKey(User, verbose_name=_("From"),related_name="communitychats", on_delete=models.DO_NOTHING)
    message = models.TextField(_("Message"))
    delete_for_me = models.ManyToManyField(User, verbose_name=_("delete for me") ,related_name='cdelforme',blank=True)
    # delete_for_all = models.BooleanField(_("delete for all"),default=False)
    media = models.FileField(_("Media"), upload_to=community_file_location,blank=True,null=True)
    date = models.DateTimeField(_("Message_date"), auto_now_add=True)
    readers = models.ManyToManyField(User, verbose_name=_("readers"),blank=True)
    
    def to(self):
        return [name for name in self.chat_community.all()]
    
    def __str__(self):
        return self.message[:30]
    
    class Meta:
        ordering = ("-date",)
        
class Community(models.Model): 
    name = models.CharField(_("Community-Name"), max_length=50)
    picture = models.ImageField(_("picture"),default='community_pictures/default_community_picture.png', upload_to=community_name_file_location,blank=True,null=True)
    members = models.ManyToManyField(User, verbose_name=_("Members"),related_name='communities')
    chats = models.ManyToManyField("CommunityChat", verbose_name=_("Chats"),blank=True,related_name='chat_community')
    date=models.DateField(_("created"), auto_now_add=True)
    creator = models.ForeignKey(User, verbose_name=_("Community Craator"), on_delete=models.DO_NOTHING)
    admins = models.ManyToManyField(User, verbose_name=_("admins"),blank=True,default='Creator',related_name='leadingcommunities')
    only_admin_chat = models.BooleanField(_("Allow Chat"),default=True)
    
    def total_members(self) :
        return self.members.count()
    
    def total_admins(self) :
        return self.admins.count()
        
    def __str__(self):
        return self.name
    
    class Meta:
        ordering = ("-chats__date",)