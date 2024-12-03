from django.urls import path
from .views import PostsView,PostView,PostAssoComments,PostAssoComment
from .views import CommentAssoComments
,CommentAssoComment
urlpatterns = [
    path('posts/',PostsView.as_view(),name='posts'),
    path('post/<int:id>/',PostView.as_view(),name='post'),
    path('post/<int:id>/comments/',PostAssoComments.as_view(),name='post-comments'),
    path('post/<int:comment_id>/comment/',PostAssoComment.as_view(),name='post-comment'),
]
