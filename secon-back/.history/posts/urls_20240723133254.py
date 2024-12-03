from django.urls import path
from .views import PostsView,PostView,PostAssoComments,PostAssoComment
from .views import CommentReply,CommentReplies
urlpatterns = [
    path('posts/',PostsView.as_view(),name='posts'),
    path('post/<int:id>/',PostView.as_view(),name='post'),
    
    path('post/<int:post_id>/comments/',CommentReplies.as_view(),name='post-comments'),
    path('post/<int:comment_id>/comment/',CommentReplies.as_view(),name='post-comment'),
]
