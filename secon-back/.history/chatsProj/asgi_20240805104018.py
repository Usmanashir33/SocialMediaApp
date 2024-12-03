import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "chatsProj.settings")
from livechatapp.urls import wsurlpatterns

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from django.core.asgi import get_asgi_application
django_asgi_app = get_asgi_application()

# from chat.consumers import AdminChatConsumer, PublicChatConsumer

application = ProtocolTypeRouter({
    # Django's ASGI application to handle traditional HTTP requests
    "http": django_asgi_app,
    "websocket": AllowedHostsOriginValidator(
        AuthMiddlewareStack(
            URLRouter(urlpatterns)
        )
    ),
})
