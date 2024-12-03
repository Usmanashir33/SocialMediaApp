from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from django.urls import reverse
import os

def set_picture(instance,filename) :
    ext = os.path.splitext(filename)[1]
    name = f"{instance.username}_pic{ext}"
    return os.path.join("users_picture/",name)

class User(AbstractUser):
    username = models.CharField(_("username"), max_length=50)
    email = models.EmailField(_("email"), unique=True, max_length=254)
    picture = models.ImageField(_("profile pic"), upload_to=set_picture, blank=True,null=True, default='default.jpg')
    followers = models.ManyToManyField('self', verbose_name=_("Followers"), related_name='followings', blank=True,symmetrical=False)
    blocked_users = models.ManyToManyField('self', verbose_name=_("Followers"), related_name='followings', blank=True,symmetrical=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    class Meta:
        # db_table='accounts_user'
        ordering = ['first_name',]

   

class Profile(models.Model):
    user = models.OneToOneField(User, verbose_name=_("User"),related_name='profile', on_delete=models.CASCADE)
    title = models.CharField(_("Title"), max_length=300, blank=True, null=True)
    address = models.CharField(_("Title"), max_length=300, blank=True, null=True)
    date = models.DateTimeField(_("Date Joined"), auto_now_add=True)

    def __str__(self):
        return self.title if self.title else f"{self.user}-profile"

    def get_absolute_url(self):
        return reverse("profile", kwargs={"pk": self.pk})

    class Meta:
        verbose_name = 'Profile'
        verbose_name_plural = 'Profiles'
        ordering = ('user',)
