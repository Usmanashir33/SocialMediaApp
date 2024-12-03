# Generated by Django 5.0.7 on 2024-09-07 14:11

import livechatapp.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('livechatapp', '0009_alter_community_only_admin_chat'),
    ]

    operations = [
        migrations.AddField(
            model_name='community',
            name='picture',
            field=models.ImageField(blank=True, default='default_community_picture.png', null=True, upload_to=livechatapp.models.community_name_file_location, verbose_name='picture'),
        ),
        migrations.AddField(
            model_name='communitychat',
            name='media',
            field=models.FileField(blank=True, null=True, upload_to=livechatapp.models.community_file_location, verbose_name='Media'),
        ),
        migrations.AddField(
            model_name='message',
            name='media',
            field=models.FileField(blank=True, null=True, upload_to=livechatapp.models.message_file_location, verbose_name='Media'),
        ),
    ]
