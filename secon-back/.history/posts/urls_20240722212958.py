from django.urls import path
from .views import GPosts
urlpatterns = [
    path('posts/',Posts.as_view(),name='posts'),
    path('post/<int:id>',Posts.as_view(),name='post'),
    # path('get-posts/',GetPosts.as_view(),name='get-posts'),
]