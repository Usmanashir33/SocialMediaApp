from django.urls import path
from .views import GetPosts
urlpatterns = [
    path('get-posts/',GetPosts.as_v)
]
