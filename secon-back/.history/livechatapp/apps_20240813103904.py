from django.apps import AppConfig


class LivechatappConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'livechatapp'
    def ready(self):
        import liv
