from django.urls import path
from .views import GetPosts
urlpatterns = [
    path('get-posts/',GetPosts.as_view(),name='get-posts'),
    path('get-posts/',GetPosts.as_view(),name='g'),
    path('get-posts/',GetPosts.as_view(),name='get-posts'),
]
