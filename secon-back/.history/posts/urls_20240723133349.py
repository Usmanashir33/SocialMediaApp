from django.urls import path
from .views import PostsView,PostView,PostAssoComments,PostAssoComment
from .views import CommentReply,CommentReplies
urlpatterns = [
    path('posts/',PostsView.as_view(),name='posts'),
    path('post/<int:id>/',PostView.as_view(),name='post'),
    
    path('post/<int:post_id>/comments/',PostAssoComments.as_view(),name='post-comments'),
    path('post/<int:comment_id>/comment/',PostAssoComment.as_view(),name='post-comment'),

    path('commen/<int:post_id>/comments/',PostAssoComments.as_view(),name='post-comments'),
    path('post/<int:comment_id>/comment/',PostAssoComment.as_view(),name='post-comment'),
]