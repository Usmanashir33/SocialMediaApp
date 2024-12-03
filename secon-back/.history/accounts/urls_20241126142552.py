from django.urls import path
from .views import ProfileView,RegisterView,DeleteAccountView,GetUserView,UserView,UserBlock
from .views import UserPostsView,Search,UserRepliesView,UserLikesView,UserFollow,UserFollowers,UserFollowings
from .authViews import VerifyOldPasswordView,ChangeUserPasswordView,RequestForgetPWDOTP,CheckFPWOTPView
urlpatterns = [
    path("profile/<int:id>/",ProfileView.as_view(),name='user-profile'),
    path("user/<int:user_id>/",UserView.as_view(),name='get-user'),
    path("user/<int:user_id>/posts/",UserPostsView.as_view(),name='get-user-posts'),
    path("user/<int:user_id>/replies/",UserRepliesView.as_view(),name='get-user-replies'),
    path("user/<int:user_id>/likes/",UserLikesView.as_view(),name='get-user-replies'),
    path("register/",RegisterView.as_view(),name='register'),
    path("user/<int:user_id>/follow/",UserFollow.as_view(),name='follow'),
    path("user/<int:user_id>/block/",UserBlock.as_view(),name='blocking'),
    path("user/<int:user_id>/followings/",UserFollowings.as_view(),name='followings'),
    path("user/<int:user_id>/followers/",UserFollowers.as_view(),name='followers'),
    path("search/",Search.as_view(),name='search'),
    
    # auth section
    path("auth/check-old-password/",VerifyOldPasswordView.as_view(),name='check-old-password'),
    path("auth/change-old-password/",ChangeUserPasswordView.as_view(),name='check-old-password'),
    
    path("auth/request-forget-password/",RequestForgetPWDOTP.as_view(),name='forget-password'),
    path("auth/verify-otp/",CheckFPWOTPView.as_view(),name='verify-otp'),
    path("auth/se/",CheckFPWOTPView.as_view(),name='verify-otp'),
    
    path("get-request-user/",GetUserView.as_view(),name='request-user'),
    path('delete-account/',DeleteAccountView.as_view(),name='delete-account'),
]