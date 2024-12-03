from django.urls import path
from .views import GetPosts
urlpatterns = [
    path('get-adposts/',GetPosts.as_view(),name='get-posts'),
    path('get-posts/',GetPosts.as_view(),name='posts'),
    path('get-posts/',GetPosts.as_view(),name='get-posts'),
]
