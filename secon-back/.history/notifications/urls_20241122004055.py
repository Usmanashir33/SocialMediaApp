from django.urls import path
from .views import  UserNotificationView,UserDeleteNotificationView,UserDeleteFNotificationView,UserDeleteAllNotificationView,UserReadNotificationView
urlpatterns = [
    path("mine/",UserNotificationView.as_view(),name='comdelnot'),
    path("viewed/",UserReadNotificationView.as_view(),name='viewd-notifications'),
    path("mine/delete/<int:notification_id>/community",UserDeleteNotificationView.as_view(),name='delete-mine-notifications'),
    path("mine/delete/<int:notification_id>/following",UserDeleteFNotificationView.as_view(),name='delete-mine-Fnotifications'),
    path("mine/delete/notificatio/all",UserDeleteAllNotificationView.as_view(),name='delete-mine-Allnotifications'),
]
