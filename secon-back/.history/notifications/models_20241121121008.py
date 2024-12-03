from django.db import models
from django.utils.translation import gettext_lazy as _
from accounts.models import User

# Create your models here.
class CommunityDelNotification(models.Model):
    status = models.CharField(_("status"), max_length=50,default="community_deletion",editable=False)
    members = models.ManyToManyField(User, verbose_name=_("user notification"),blank=True,related_name='comdelnot')
    message = models.CharField(_("notification"), max_length=50)
    readers = models.ManyToManyField(User, verbose_name=_("notification readers"),blank=True)
    created = models.DateTimeField(_("date"), auto_now_add=True)
    info = models.CharField(_("status"),blank=True, max_length=50)
    action = models.CharField(_("type of action"),blank=True, max_length=50)
    name = models.CharField(_("community-name"),blank=True, max_length=50)
    deleter = models.CharField(_("community-deleter"),blank=True, max_length=50)  
     

    def __str__(self):
        return self.message[:20]
    
class FollowingNotification(models.Model):
    status = models.CharField(_("status"), max_length=50,default="following",editable=False)
    i use many realatio ship here to make it easier in my fron end joinings algorith
    follower = models.ForeignKey(User, verbose_name=_("follower"), related_name='whoifollow',on_delete=models.DO_NOTHING,blank=True)
    following = models.ForeignKey(User, verbose_name=_("following"),related_name='whofollow', on_delete=models.DO_NOTHING,blank=True)
    date=models.DateTimeField(_("Date"), auto_now_add=True)
   
    def __str__(self):
        return f"{self.follower} following {self.following}"

    

 