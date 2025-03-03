# Generated by Django 5.0.7 on 2024-11-22 09:32

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('livechatapp', '0020_alter_message_delete_for_me'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterField(
            model_name='message',
            name='delete_for_me',
            field=models.ManyToManyField(to=settings.AUTH_USER_MODEL, verbose_name='delete for me'),
        ),
    ]
