from django.urls import path
from .views import PostsView,PostView
urlpatterns = [
    path('posts/',PostsView.as_view(),name='posts'),
    path('post/<int:id>/',PostView.as_view(),name='post'),
    path('post/<int:id>/',PostView.as_view(),name='post'),
    # path('get-posts/',GetPosts.as_view(),name='get-posts'),
]
