from django.contrib import admin
from.models import Profile,User
from.models import Profile
# Register your models here.
@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display=['user','title']
@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display=['username','email',"first_name","last_name","]
    pass

