from django.urls import path
from .views import GetPosts
urlpatterns = [
    path('posts/',Posts.as_view(),name='get-posts'),
    path('post/<int:id>',Posts.as_view(),name='posts'),
    path('get-posts/',GetPosts.as_view(),name='get-posts'),
]
