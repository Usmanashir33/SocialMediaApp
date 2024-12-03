# from django.shortcuts import render
from.serializers import CommentSerializer, CommenterSerializer,PostSerializer,PosterSerializer
from accounts.serializers import UserSerializer
from django.db.models import Q

from rest_framework.views import APIView
from rest_framework.response import Response
# from rest_framework import permissions
from rest_framework import status
from .models import Post,Comment
import json

# Create your views here.
# you can add and get posts 
class PostsView(APIView):
    def get(self, request, format=None):
        try:
            user= request.user 
            posts = Post.objects.filter(~Q(not_interested = user)) # inwich user is not inthe list not interested members
            
            serializer = PostSerializer(posts,many=True)
            return Response(serializer.data,status=status.HTTP_200_OK)
        except:
            return Response({"error":"server faild to fetch"})

    def post(self, request, format=None):
        try:
            user = request.user 
            body = request.data['body']
            # new_post = Post.objects.create(user=user,body=body)
            serializer = PosterSerializer(data={'body':body,"user":user.id})
            if serializer.is_valid():
                serializer.save()
                new_post = json.loads(json.dumps(serializer.data))
                # print(new_post["id"])
                new_post = Post.objects.get(id = new_post['id'])
                post_serializer = PostSerializer(new_post)
                # return Response(post_serializer.data)    
                return Response(post_serializer.data,status=status.HTTP_201_CREATED)    
            return Response({'error':'server faild to validate'})
        except:
            return Response({'error':'something went wrong'})

# you can edit, get and delete a particulet post
class PostsNotInterestedView(APIView):
    def get(self, request, post_id,format=None):
        try:
            user = request.user.id
            post = Post.objects.get(id = post_id)  
            if user in post.not_interested.all():
                post.not_interested.remove(user)
                print('added')
            else :
                post.not_interested.remove(user)
                print('removed')
                
            return Response({"success" : "interest"})
        except:
            return Response({"error":"server faild to fetch"})
        
class PostView(APIView):
    def get(self, request, id, format=None):
        try:
            # print(pk)
            post = Post.objects.get(id=id)
            post_comments=post.postcomments.filter(parent = None).order_by('-date')
            serializer = PostSerializer(post).data
            serializer['postcomments'] = CommentSerializer(post_comments,many=True).data
            return Response(serializer,status=status.HTTP_200_OK)
        except:
            return Response({'error':'something went wrong in processing the data'})

    def put(self, request, id,format=None):
        try:
            post = Post.objects.get(id=id)
            user = request.user
            body = request.data['body']
            if post.user.id == request.user.id :
                serializer = PosterSerializer(post,data={"user":user.id,"body":body})
                if serializer.is_valid():
                    serializer.save()
                    updated_post = json.loads(json.dumps(serializer.data))
                    updated_post = Post.objects.get(id = updated_post['id'])
                    post_serializer = PostSerializer(updated_post)
                    # return Response(post_serializer.data)    
                    return Response(post_serializer.data,status=status.HTTP_201_CREATED)    
                return ({'error':'not Updated'})
            return Response({'error':'server faild to validate ownership'})
        except:
            return Response({'error':'something went wrong'})
    def delete(self, request, id,format=None):
        try:
            post = Post.objects.get(id = id)
            user = request.user
            if post.user.id == user.id :
                post.delete()
                return Response({"success":"Deleted"})
            else:
                return Response({"error":"sorry you can only delete your posts"})
        except:
            return Response({'error':'something went wrong'})

# you can get and add comment to a post  we need podt id
class PostAssoComments(APIView):
    # comments of a perticular post 
    def get(self, request, post_id ,format=None):
        try :
            comments = Post.objects.get(id=post_id).postcomments.all().filter(parent = None).order_by('-date')
            serializer = CommentSerializer(comments,many=True)
            return Response(serializer.data,status=status.HTTP_206_PARTIAL_CONTENT)
        except :
            return Response({'error':"something went wrong"})

    def post(self, request, post_id ,format=None):
        # we get the post id 
        new_comment ={
            'body':request.data['body'],
            'user':request.user.id,
            'post':post_id
        } 
        try :
            serializer = CommenterSerializer(data=new_comment)
            if serializer.is_valid():
                serializer.save()
                new = json.loads(json.dumps(serializer.data))
                newcomment = Comment.objects.get(id = new['id'])
                nextserializer = CommentSerializer(newcomment)
                return Response(nextserializer.data,status=status.HTTP_201_CREATED)
            return Response({'error':"post comment failed"})
        except :
            return Response({'error':"something went wrong"})

# you can get ,delete and update a particular comment of a post 
class PostAssoComment(APIView):
    # get comment id  
    def get(self, request, comment_id, format=None):
        try:
            comment = Comment.objects.get(id=comment_id)
            serializer = CommentSerializer(comment)
            return Response(serializer.data,status=status.HTTP_200_OK)
        except:
            # return Response(serializer.errors)
            return Response({'error':'something went wrong!'})

    def put(self, request, comment_id,format=None):
        # we need userid and post id  comment id
        try:
            comment = Comment.objects.get(id=comment_id)
            user_id = request.user.id
            
            updated_comment = {
                "user":user_id,
                "post":comment.post.id,
                "body":request.data['body']
                }
            
            if comment.user.id == user_id :
                serializer = CommenterSerializer(comment,data=updated_comment)
                if serializer.is_valid():
                    serializer.save()
                    new = json.loads(json.dumps(serializer.data))
                    newcomment = Comment.objects.get(id = new['id'])
                    nextserializer = CommentSerializer(newcomment)
                    return Response(nextserializer.data,status=status.HTTP_201_CREATED)
                return Response(serializer.errors,status=status.HTTP_201_CREATED)
            else:
                return Response({'error':"sorry you can only edit your comments"})
        except:
            return Response({'error':'something went wrong'})
    def delete(self, request, comment_id,format=None):
        try:
            comment = Comment.objects.get(id = comment_id)
            user_id = request.user.id
            if comment.user.id == user_id : 
                comment.delete()
                return Response({"success":'deleted '})
            else:
                return Response({'error':"sorry you can only delete your comments"})
        except:
            return Response({'error':'something went wrong'})
    
# you can get and add comment to a comment(Reply)  we alsway need comment i  
class CommentReplies(APIView):
    def get(self, request, comment_id, format=None):
        try:
            replies = Comment.objects.filter(parent=comment_id).order_by('-date')
            serializer = CommentSerializer(replies,many=True)
            return Response(serializer.data,status=status.HTTP_200_OK)
        except:
            return Response({'error':"something went wrong"})
    
    def post(self, request, comment_id, format=None):
        # try:
            post_id = Comment.objects.get(id = comment_id).post.id
            reply={
                "user" : request.user.id ,
                "parent" : comment_id ,
                "post" : post_id,
                "body" : request.data['body']
            }
            serializer = CommenterSerializer(data=reply)
            if serializer.is_valid():
                serializer.save()
                newcomment = json.loads(json.dumps(serializer.data))
                newcomment = Comment.objects.get(id=newcomment['id'])
                endSerializer = CommentSerializer(newcomment)
                return Response(endSerializer.data,status=status.HTTP_200_OK)
            return Response(serializer.errors)
            # return Response({"error":"faild by server auth"})
        # except:
            # return Response({'error':"something went wrong"})
            # return Response({'error':"something went wrong"})
        
class CommentReply(APIView):
    def get(self, request, reply_id, format=None):
        try:
            comment = Comment.objects.get(id=reply_id)
            serializer = CommentSerializer(comment)
            return Response(serializer.data,status=status.HTTP_200_OK)
        except:
            return Response({'error':"something went wrong"})
        
    def put(self, request, reply_id, format=None,):
        try:
            comment = Comment.objects.get(id =reply_id)
            user_id = request.user.id
            updated_reply={
                "user" : request.user.id ,
                "parent" : reply_id ,
                "post" : comment.post.id,
                "body" : request.data['body']
            }
            if user_id == comment.user.id:
                serializer = CommentSerializer(comment,updated_reply)
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data,status=status.HTTP_202_ACCEPTED)
                else:
                    return Response({"error":"faild update"})
                    # return Response(serializer.errors)
            else:
                return Response({"error":'ypu cant perform this action'})
        except:
            return Response({'error':"something went wrong"})
    def delete(self, request, reply_id, format=None,):
        try:
            comment = Comment.objects.get(id =reply_id)
            user_id = request.user.id
            if user_id == comment.user.id:
                comment.delete()
                return Response({"success":"deleted"})
            else:
                return Response({"error":'ypu cant perform this action'})
        except:
            return Response({'error':"something went wrong"})
        
class PostLikeView(APIView):
    def get(self, request, post_id ):
        try:
            user_id = request.user.id
            post = Post.objects.get(id = post_id)
            
            if post.likes.filter(id=user_id):
                post.likes.remove(user_id)
                return Response({'unlike':"unliked"})
            else:
                post.likes.add(user_id)
                return Response({'like':"liked"})
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)

class CommentLikeView(APIView):
    def get(self, request, comment_id ):
        try:
            user_id = request.user.id
            comment = Comment.objects.get(id = comment_id)
            
            if comment.likes.filter(id=user_id):
                comment.likes.remove(user_id)
                return Response({'add':"removed"})
            else:
                comment.likes.add(user_id)
                return Response({'add':"added"})
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)