from django.contrib import admin
from.models import Post,Comment

# Register your models here.
@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display=['user',"total_likes",'display_body'']
    pass

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display=['user','post',"total_likes",'display_body']
    pass
