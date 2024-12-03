import json

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.core.files.base import ContentFile
from accounts.models import User
from .models import Message
from django.db.models import Q
from .models import Message,CommunityChat,Community
from posts.serializers import MiniUserSerializer
from .serializers import MessageSerializer,SaveMessageSerializer,CommunityChatSerializer,ChatSerializer
from rest_framework_simplejwt.tokens import UntypedToken

class LiveChatConsumer(AsyncWebsocketConsumer) :
    #connection to the websocket
    async def connect(self):
        # print(self.scope)
        token = self.scope.get('query_string').decode().split('token=')[1]
        self.user = await get_user_by_token(token)
        self.file_data = b'' # for the file data temp
        self.message_data = {} # store temp
        if self.user :
            self.user_id = self.user.id
            self.user_room = f"chat_room{self.user_id}" # itll be unique for every user 
            # self.friend_id = self.scope['url_route']['kwargs']['id'] # grab the url parame
            await self.channel_layer.group_add(
                self.user_room, self.channel_name
            )
            await self.accept()
            print(f"accepted user :{self.user_id} , friend : ")
        else :
            await self.close()
        
    # disconnection to the websocket
    async def disconnect(self, code):
       await self.channel_layer.group_discard(
           self.user_room, self.channel_name
       )
       print('disclosed')
        
    # receiving data after connection
    async def receive(self, bytes_data=None, text_data=None):
        if bytes_data :
            self.file_data += bytes_data
            
        if text_data :
            data = json.loads(text_data)
            # print(text_data)
            
            if data['status'] == 'message' and data['withFile']: # the file is sent
                self.message_data = data
                
            if data['status'] == 'message' and not data['withFile']: # the file is not sent
                self.user_to = data['user_to']
                self.friend_room = f"chat_room{self.user_to}" # itll be unique for every user 
                response ={
                    "message" :data['message'],
                    "user_to" : self.user_to ,
                    'user_from': self.user_id,
                    'media' : None
                }
                message = await serialize_and_save(response)
                message['type'] = "chat_message"
                await self.channel_layer.group_send(
                       self.user_room , message
                    )
                await self.channel_layer.group_send(
                       self.friend_room , message
                    )
                
            if data['status'] == 'sent': # its message with file
                filename = data['filename']
                file = ContentFile(self.file_data,name=filename)
                self.user_to = self.message_data['user_to']
                self.friend_room = f"chat_room{self.user_to}" # itll be unique for every user 
                response ={
                    "message" :self.message_data['message'],
                    "user_to" : self.user_to ,
                    'user_from': self.user_id,
                    'media' : file
                }
                message = await serialize_and_save(response)
                message['type'] = "chat_message"
                await self.channel_layer.group_send(
                       self.user_room , message
                    )
                await self.channel_layer.group_send(
                       self.friend_room , message
                    )
                self.file_data = b''
                self.message_data ={}
            
             # the signal is to read all unread messages
            if data['status'] == "unreadMessages" :
                self.user_from =data['user_to'] # imean frd here its mis use 
                self.friend_roo = f"chat_room{self.user_from}"
                messageDetails ={
                    "user_to" : self.user_id ,
                    'user_from': self.user_from,
                }
                message = await readMessages(messageDetails)
                if message == 'done':
                    message = {
                        'type':'chat_message',
                        'status' :'unreadMessages',
                        'action' : "done"
                    }
                    # send it only to the message sender
                    await self.channel_layer.group_send(
                        self.friend_room , message
                        )
                
                
    async def chat_message(self,data) :
        # sending to websocket 
        await self.send(json.dumps(data))
        

class CommunityChatConcumer(AsyncWebsocketConsumer) :
    #connection to the websocket
    async def connect(self):
        self.community_id = self.scope['url_route']['kwargs']['id'] # grab the url parame
        self.community  =await  get_Community_by_id(self.community_id)
        
        token = self.scope.get('query_string').decode().split('token=')[1]
        self.user = await get_user_by_token(token)
        self.file_data = b'' # for the file data temp
        self.message_data = {} # store temp
        if self.user and self.community :
            self.user_id = self.user.id
            self.user_room = f"community{self.user_id}_{self.community_id}" # itll be unique for every user 
            
            await self.channel_layer.group_add(
                self.user_room, self.channel_name
            )
            await self.accept()
            print(f"accepted user :{self.user_id} , room : {self.community_id}")
        else :
            await self.close()
        
    # disconnection to the websocket
    async def disconnect(self, code):
       await self.channel_layer.group_discard(
           self.user_room, self.channel_name
       )
       print('disclosed')
        
    # receiving data after connection
    async def receive(self, bytes_data=None, text_data=None):
        if bytes_data :
            self.file_data += bytes_data
        
        if text_data :
            data = json.loads(text_data)
            # print(text_data)
            
            if data['status'] == 'message' and data['withFile']: # the file is sent
                self.message_data = data
                
            if data['status'] == 'message' and not data['withFile']: # the file is not sent
                # self.user_to = data['user_to']
                # self.friend_room = f"chat_room{self.user_to}" # itll be unique for every user 
                message = data['message']
                response ={
                    "message" :message,
                    'user_from': self.user_id,
                    "chat_community" :[self.community_id],
                    'media' : None
                }
                message = await serialize_and_save(response)
                message = await serialize_and_save_chat(self.user,self.community_id,response)
                
                if message is None:
                    return
                else :
                    message['type'] = "community_message"
                    message["chat_community"] = [self.community_id]
                    
                    community_members =  await get_members(self.community)
                    for member in community_members :
                        member_room = f"community{member}_{self.community_id}"
                        await self.channel_layer.group_send(
                            member_room , message
                        )
        
            if data['status'] == 'sent': # its message with file
                filename = data['filename']
                file = ContentFile(self.file_data,name=filename)
                message = self.message_data['message']
                response ={
                    "message" :message,
                    'user_from': self.user_id,
                    "chat_community" :[self.community_id],
                    'media' : file
                }
                message = await serialize_and_save(response)
                message = await serialize_and_save_chat(self.user,self.community_id,response)
                
                if message is None:
                    return
                else :
                    message['type'] = "community_message"
                    message["chat_community"] = [self.community_id]
                    
                    community_members =  await get_members(self.community)
                    for member in community_members :
                        member_room = f"community{member}_{self.community_id}"
                        await self.channel_layer.group_send(
                            member_room , message
                        )
                    # reset temporary saved datas
                    self.file_data = b''
                    self.message_data ={}
    async def community_message(self,data) :
        # sending websocket 
        await self.send(json.dumps(data))

class CallingConsumer(AsyncWebsocketConsumer) :
    async def connect(self):
        token = self.scope.get('query_string').decode().split('token=')[1]
        self.user = await get_user_by_token(token)
        if self.user :
            self.user_id = self.user.id
            self.user_room = f"call_user_{self.user_id}" # itll be unique for every user 
            await self.channel_layer.group_add(
                self.user_room, self.channel_name
            )
            await self.accept()
            print(f"call user connected")
        else :
            await self.close()
        
    # disconnection to the websocket
    async def disconnect(self, code):
       await self.channel_layer.group_discard(
           self.user_room, self.channel_name
       )
       print('calling socket disclosed')
       
    async def receive(self,text_data):
        if text_data :
            data = json.loads(text_data)
            SIGTYP = data['signalType']
            try :
                friend = data['friend']
                friend_id = friend
                self.friend_room = f"call_user_{friend_id}" # itll be unique for every user 
                if SIGTYP == 'request' :
                    callSender = data['callSender']
                    callSender = await get_user_by_id(callSender)
            except :
                pass
            
            if data:
                response = {
                    "signal" :data['signal'],
                    "friend" :friend,
                    'requestType' : data['requestType'],
                    'signalType' : SIGTYP,
                    'callSender': callSender,
                    "type" : "send_response"
                }if SIGTYP == 'request' else {
                    'signalType' : SIGTYP,
                    "type" : "send_response",
                    # "signal" :data['signal'], no signal from peer 
                }if SIGTYP == 'rejectcall' or  SIGTYP == 'endcall' else {
                    'signalType' : SIGTYP,
                    "type" : "send_response",
                    # "signal" :data['signal'], # signal from peer
                }if SIGTYP == 'approvecall' else None
                
                await self.channel_layer.group_send(
                        self.friend_room , response
                    )
                if  SIGTYP != "request" : # the rest type of reques
                    await self.channel_layer.group_send(
                       self.user_room , response
                    )
                    
    async def send_response(self,data) :
        # sending back to websocket 
        await self.send(json.dumps(data))
        

@database_sync_to_async    
def get_user_by_token(token) :
        decoded = UntypedToken(token).payload
        user_id = decoded.get('user_id')
        user = User.objects.get(id = user_id)
        return user if user else None
    
@database_sync_to_async    
def get_user_by_id(id) :
        user = User.objects.get(id = id)
        serialized_user = MiniUserSerializer(user)
        return serialized_user.data 
    
@database_sync_to_async
def serialize_and_save(data):
    serializer = SaveMessageSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        messageId = json.loads(json.dumps(serializer.data))['id']
        new = Message.objects.get(id = messageId)
        newSerializer = MessageSerializer(new)
        return newSerializer.data

@database_sync_to_async
def readMessages(data):
    user_id = data['user_from']
    friend_id = data['user_to']
    messages = Message.objects.filter(
       Q(user_from = friend_id,user_to = user_id) & Q(read = False)) 
    for message in messages :
       message.read = True
       message.save()
    return "done"
@database_sync_to_async
def get_Community_by_id(id) :
    try :
        community = Community.objects.get(id = id)
        if community :
            return community
    except :
        pass
    
@database_sync_to_async
def get_members(community) :
    try :
        members = community.members.values_list("id",flat=True)
        if members :
            return members
    except :
        pass
@database_sync_to_async
def serialize_and_save_chat(user,id,data):
    community = Community.objects.get(id = id)
    
    if community.only_admin_chat and not user in community.admins.all():
        #make only admin can send message if set on the community
        print("messsage not saved")
        return None
    else :
        new_message = CommunityChat.objects.create(
        message = data["message"],
        user_from= user,
        media = data['media']
        )
        community.chats.add(new_message)
        print(community)
        outer = ChatSerializer(new_message)
        return outer.data
            