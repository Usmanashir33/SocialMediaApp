from django.urls import path
from .views import PostsView,PostView,PostCommentVie
urlpatterns = [
    path('posts/',PostsView.as_view(),name='posts'),
    path('post/<int:id>/',PostView.as_view(),name='post'),
    path('post/<int:id>/comments/',PostCommentVie.as_view(),name='post'),
    # path('get-posts/',GetPosts.as_view(),name='get-posts'),
]
