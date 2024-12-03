from django.db import models
from django.utils.translation import gettext_lazy as _
from accounts.models import User

# Create your models here.
class CommunityDelNotification(models.Model):
    members = models.ManyToManyField(User, verbose_name=_("user notification"),blank=True,related_name='comdelnot')
    message = models.CharField(_("notification"), max_length=50)
    readers = models.ManyToManyField(User, verbose_name=_("notification readers"),blank=True)
    created = models.DateTimeField(_("date"), auto_now_add=True)
    status = models.CharField(_("status"),blank=True, max_length=50)
    action = models.CharField(_("type of action"),blank=True, max_length=50)
    name = models.CharField(_("community-name"),blank=True, max_length=50)
    deleter = models.CharField(_("community-deleter"),blank=True, max_length=50)  
     

    def __str__(self):
        return self.message[:20]
class Following(models.Model):

    

   
    def __str__(self):
        return self.name

    

 