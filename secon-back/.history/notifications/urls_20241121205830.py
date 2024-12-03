from django.urls import path
from .views import  UserNotificationView,UserDeleteNotificationView,UserReadNotificationView
urlpatterns = [
    path("mine/",UserNotificationView.as_view(),name='comdelnot'),
    path("viewed/",UserReadNotificationView.as_view(),name='viewd-notifications'),
    path("mine/delete/<int:notification_id>/",UserDeleteNotificationView.as_view(),name='delete-mine-notifications'),
    path("mine/delete/<int:notification_id>/",UserDeleteNotificationView.as_view(),name='delete-mine-notifications'),
]
