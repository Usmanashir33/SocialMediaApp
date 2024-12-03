import json

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from accounts.models import User
# from .models import Message
# from .models import Message,CommunityChat,Community

from rest_framework_simplejwt.tokens import UntypedToken

class SingleUserNotificationConsumer(AsyncWebsocketConsumer) :
    #connection to the websocket
    async def connect(self):
        # print(self.scope)
        token = self.scope.get('query_string').decode().split('token=')[1]
        self.user = await get_user_by_token(token)
        if self.user :
            self.user_id = self.user.id
            self.user_room = f"notification_user_{self.user_id}" # itll be unique for every user 
            print(self.user_room)
            await self.channel_layer.group_add(
                self.user_room, self.channel_name
            )
            await self.accept()
            print(f"accepted user :{self.user_id}")
        else :
            await self.close()
        
    # disconnection to the websocket
    async def disconnect(self, code):
       await self.channel_layer.group_discard(
           self.user_room, self.channel_name
       )
       print('disclosed')
        
    # receiving data after connection
    # async def receive(self, text_data):
    #     data = json.loads(text_data)
    #     message = data['message']
    #     message['type'] = "user_notification"
    #     await self.channel_layer.group_send(
    #            self.user_room , message
    #         )
    async def user_notification(self,data) :
        # sending websocket 
        # print(data,'to view')
        await self.send(json.dumps(data))
        
@database_sync_to_async    
def get_user_by_token(token) :
        decoded = UntypedToken(token).payload
        user_id = decoded.get('user_id')
        user = User.objects.get(id = user_id)
        return user if user else Noneg