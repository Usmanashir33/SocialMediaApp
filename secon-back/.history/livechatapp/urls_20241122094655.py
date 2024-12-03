from django.urls import path,re_path,include
from .views import AllChats,GetUserMessages,GetAllCommunities,CommunityData,UnreadChats
from .views import CommunityView,CommunityMembersView,CommunityExit,SetOnlyAdminView,JoinCommunityView
from .views import AddorRemoveMember
from notifications.consumers import SingleUserNotificationConsumer
from.consumers import LiveChatConsumer,CommunityChatConcumer,CallingConsumer

urlpatterns = [
    path('chathome/',AllChats.as_view(),name='chat-home'),
    path('chat/delete',AllChats.as_view(),name='delete-chat-for-me'),
    path('chatroom/<int:user_id>/',GetUserMessages.as_view(),name='unread-chat'),
    path('communities/',GetAllCommunities.as_view(),name='communities'),
    path('community/<int:community_id>/',CommunityData.as_view(),name='community-room'),
    path('community/<int:community_id>/members/',CommunityMembersView.as_view(),name='community-room'),
    path("alter-community/",CommunityView.as_view(),name='community'),
    path("exit-community/<int:community_id>/",CommunityExit.as_view(),name='community-exit'),
    path("stopchat-community/<int:community_id>/",SetOnlyAdminView.as_view(),name='stopchat-community'),
    path("join-community/<int:community_id>/",JoinCommunityView.as_view(),name='join-community'),
    path("alter-membership/<int:community_id>/",AddorRemoveMember.as_view(),name='addorremove-member'),
]
ws_urlpatterns = [
    re_path(r"chatroom/dm/(?P<id>\w+)/$",LiveChatConsumer.as_asgi()),
    # re_path(r"community/(?P<id>\w+)/$",CommunityChatConcumer.as_asgi()),
    path("community/<int:id>/",CommunityChatConcumer.as_asgi()),
    path('notifications/mine/',SingleUserNotificationConsumer.as_asgi()),
    path('call_connection/',CallingConsumer.as_asgi()),
]
