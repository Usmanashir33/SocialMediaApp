from django.shortcuts import render
from .serializers import ProfileSerializer, UserSerializer
from rest_framework.views import APIView
from rest_framework import permissions
from rest_framework import status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser,FormParser
from.models import Profile
from .models import User
from django.db.models import Q
from livechatapp.models import Community
from livechatapp.serializers import CommunitiesSerializer
from notifications.models import FollowingNotification

# Create your views here.
class ProfileView(APIView):
    # default permission is autenticated
    # get profile by its user id
    parser_classes = (MultiPartParser,FormParser)
    def get(self, request, id ,format=None):
        try :
            profile = Profile.objects.get(user = id)
            serializer = ProfileSerializer(profile)
            return Response(serializer.data)
        except :
            return Response({"error" : 'server faild the data'},status=status.HTTP_408_REQUEST_TIMEOUT)
    def put(self, request,id,format=None):
            # very only user can edit his profile 
        if request.user.id == id :
            try:
                profile = Profile.objects.get(user = request.user.id)
                serializer = ProfileSerializer(profile,data=request.data)
                if (serializer.is_valid()):
                    serializer.save()
                    return Response(serializer.data,status=status.HTTP_202_ACCEPTED)
            except :
                return Response({'error' : "server failed to update,try again"})
        
        else :
            return Response({'error':"only user can edit his profile"})

class RegisterView(APIView):
    permission_classes=[permissions.AllowAny]
    def post(self, request, format=None):
        try:
            email = request.data['email'].lower()
            username = request.data['username'].lower()
            password1 = request.data['password']
            password2 = request.data['re_password']
            emailfound = User.objects.filter(email = email).exists()
            usernamefound = User.objects.filter(username = username).exists()
            if not usernamefound :# username not selected
                if not emailfound :# username not selected
                    if len(password1) >= 6 and (password1 == password2):
                            newuser = User.objects.create_user(
                                email=email,
                                username=username,
                                password=password1
                            )
                            #  create profile 
                            Profile.objects.create(
                                user = newuser
                            )
                            return Response({"success":"succefully registered"})
                        # return Response(serializer.errors)
                    else :
                        return Response({'error' : "passwords short or mismatched!"})
                else:
                    return Response({'error' : "email already exists"})
            else:
                return Response({'error' : "username already exists"})
        except:
            return Response({"error":"server failed to register"})
        
class DeleteAccountView(APIView):
    def get(self, request, format=None):
        try :
            account = User.objects.get(id=request.user.id)
            account.delete()
            return Response({"success":"account successfully deleted"})
        except :
            return Response({"error":"something went wrong"})


class GetUserView(APIView):
    def get(self, request, format=None):
        # user = User.objects.get(id = request.user.id)
        try :
            user = request.user
            if user :
                serializer = UserSerializer(user)
                return Response(serializer.data)
            else :
                return Response({"error":"user not found"})
        except:
            return Response({"error":"failed to fetch the user"})
        
class UserView(APIView):
    parser_classes = (MultiPartParser,FormParser)
    def get(self, request, user_id,format=None):
        try :
            user = User.objects.get(id = user_id)
            if user :
                serializer = UserSerializer(user)
                return Response(serializer.data)
            else :
                return Response({"error":"user not found"})
        except:
            return Response({"error":"failed to fetch the user"})
    def put(self, request, user_id,format=None):
        data = request.data
        file = request.data.get('picture')
        file = file if file != "null" else None
        try :
            if request.user.id == user_id:
                user = User.objects.get(id = user_id)
                profile = user.profile
                if user :
                    user.first_name =data.get('first_name')
                    user.last_name =data.get('last_name')
                    user.picture = file 
                    profile.title = data.get("title")
                    profile.address = data.get("address")
                    user.save()
                    profile.save()
                    if not user.picture: # retrive default upon delete
                        user.picture = 'default.jpg' 
                        user.save()
                    
                    serializer = UserSerializer(user)
                    return Response(serializer.data)
                else :
                    return Response({"error":"user not found"})
            return Response({"error":"You can only edit your profile"})
        except:
            return Response({"error":"failed to fetch the user"})
        
from posts.serializers import PostSerializer,CommentSerializer
from posts.models import Post,Comment
class UserPostsView(APIView):
    def get(self, request, user_id,format=None):
        try :
            posts = Post.objects.filter(user = user_id).order_by("-date")
            if posts :
                serializer = PostSerializer(posts ,many=True)
                return Response(serializer.data)
            else :
                return Response({"error":"posts  not found"})
        except:
            return Response({"error":"failed to fetch the posts"})
        
class UserRepliesView(APIView):
    def get(self, request, user_id,format=None):
        try :
            comments = Comment.objects.filter(user = user_id).order_by("-date")
            if comments :
                serializer = CommentSerializer(comments ,many=True)
                return Response(serializer.data)
            else :
                return Response({"error":"comments  not found"})
        except:
            return Response({"error":"failed to fetch the comments"})
        
class UserLikesView(APIView):
    def get(self, request, user_id,format=None):
        try :
            likesData = User.objects.get(id =user_id).userpostlikes.order_by('-date')
            if likesData :
                serializer = PostSerializer(likesData ,many=True)
                return Response(serializer.data)
            else :
                return Response({"error":"Likes posts  not found"})
        except:
            return Response({"error":"failed to fetch the comments"})

class UserFollow(APIView):
    def get(self, request, user_id,format=None):
        try:
            user = request.user
            target_user = User.objects.get(id = user_id)
            
            if user.id != target_user.id : #user can not him self
                if user in target_user.followers.all(): #user already in followers ,remove him
                    target_user.followers.remove(user)
                    return Response({"unfollow":"unfollowed"})
                else:
                    target_user.followers.add(user)
                    # create notification here 
                    notification = FollowingNotification.objects.create(
                        follower = user.id,
                        following = target_user.id
                    )
                    return Response({"follow":"followed"}) if notification else  Response({"fol":"followed"}) 
            return Response({'error' : "You can not follow your self"})
        except:
            return Response({"error":"something went wrong"})
        
class UserFollowers(APIView):
    def get(self, request, user_id ,format=None):
        try:
            user = User.objects.get(id = user_id)
            followers = user.followers.all()
            serializer = UserSerializer(followers,many=True)
            return Response(serializer.data)
        except:
            return Response({"error":"something went error"})
        
class UserFollowings(APIView):
    def get(self, request, user_id ,format=None):
        try:
            user = User.objects.get(id = user_id)
            followings = user.followings.all()
            serializer = UserSerializer(followings,many=True)
            return Response(serializer.data)
        except:
            return Response({"error":"something went error"})
        
class Search(APIView):
    def post(self, request,format=None):
        try :
            details = request.data['content']
            users = User.objects.filter(
                Q(username__icontains = details) |
                Q(first_name__icontains = details) |
                Q(last_name__icontains = details) 
            ).distinct().order_by("username")
            communities = Community.objects.filter(name__icontains = details).distinct().order_by('name')
            
            if users or communities :
                cSerializer = CommunitiesSerializer(communities,many=True)
                serializer = UserSerializer(users,many=True)
                return Response({"users":serializer.data,"communities":cSerializer.data})
            else :
                return Response({"empty" : "No record Found"})
        except :
            return Response({"error":"spmething went wrong"})