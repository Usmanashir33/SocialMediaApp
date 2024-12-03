from django.db import models
from django.conf import settings
# from django.contrib.auth.models import User
import os
from accounts.models import User
from django.utils.translation import gettext_lazy as _
from django.urls import reverse

# Create your models here.
def upload_location(instance,filename):
    # gra the extenton 
    ext = os.path.splitext(filename)[1]
    name = f"post_{instance.id}_file{ext}"
    return os.path.join("post_media/",name)

def upload_location_comment(instance,filename):
    # gra the extenton 
    ext = os.path.splitext(filename)[1]
    name = f"comment_{instance.id}_file{ext}"
    return os.path.join("comment_media/",name)

class Post(models.Model):
    """Model definition for Post.""" 
    user = models.ForeignKey(User, verbose_name=_("post user"), related_name='userposts',on_delete=models.CASCADE)
    body = models.TextField(_("post"),max_length=300,blank=True,null=True)
    file = models.FileField(_("post file"), upload_to=upload_location, blank=True,null=True)
    likes = models.ManyToManyField(User, verbose_name=_("post likes"), blank=True, related_name='userpostlikes')
    shares = models.ManyToManyField(User, verbose_name=_("post shares"), blank=True , related_name='userpostshares')
    reposts = models.ManyToManyField(User, verbose_name=_("post reposts"), blank=True, related_name='userpostreposts')
    views = models.IntegerField(_("Views"), default=0,blank=True)
    date = models.DateTimeField(_("post-date"), auto_now_add=True)
    not_interested = models.ManyToManyField(User, blank=True)
    class Meta:
        """Meta definition for Post."""
        verbose_name = 'Post'
        verbose_name_plural = 'Posts'

    def __str__(self):
        """Unicode representation of Post."""
        return self.body[:20]

    def display_body(self):
        return f"{self.body[:20]}..."
    
    def total_likes(self):
        return self.likes.count()

    def get_absolute_url(self):
        return reverse("post-detail", kwargs={"pk": self.pk})
    


class Comment(models.Model):
    """Model definition for comment."""
    user = models.ForeignKey(User, verbose_name=_("comment user"), related_name='usercomments', on_delete=models.CASCADE)
    post = models.ForeignKey(Post, verbose_name=_("comment post"), related_name='postcomments', on_delete=models.CASCADE)
    parent = models.ForeignKey('self', verbose_name=_("Parent-comment"),related_name='replies', null=True,blank=True, on_delete=models.CASCADE)
    body = models.TextField(_("comment"),max_length=300,blank=True,null=True)
    file = models.FileField(_("comment file"), upload_to=upload_location_comment, blank=True,null=True)
    likes = models.ManyToManyField(User, verbose_name=_("comment likes"), blank=True, related_name='usercommentlikes')
    shares = models.ManyToManyField(User, verbose_name=_("comment shares"), blank=True, related_name='usercommentshares')
    reposts = models.ManyToManyField(User, verbose_name=_("comment reposts"),  blank=True, related_name='usercommentreposts')
    views = models.IntegerField(_("Views"), default=0,blank=True, )
    # comment = models.ForeignKey( verbose_name=_(""), on_delete=models.CASCADE)    
    date = models.DateTimeField(_("comment-date"), auto_now_add=True)
    class Meta:
        """Meta definition for comment."""
        verbose_name = 'comment'
        verbose_name_plural = 'comments'

    def __str__(self):
        """Unicode representation of comment."""
        return self.body[:20]
    
    def display_body(self):
            return f"{self.body[:20]}..."
    
    def total_likes(self):
        return self.likes.count()

    def get_absolute_url(self):
        return reverse("comment-detail", kwargs={"pk": self.pk})
    