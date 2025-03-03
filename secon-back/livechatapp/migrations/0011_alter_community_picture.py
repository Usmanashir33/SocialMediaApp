# Generated by Django 5.0.7 on 2024-09-07 14:12

import livechatapp.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('livechatapp', '0010_community_picture_communitychat_media_message_media'),
    ]

    operations = [
        migrations.AlterField(
            model_name='community',
            name='picture',
            field=models.ImageField(blank=True, default='community_pictures/default_community_picture.png', null=True, upload_to=livechatapp.models.community_name_file_location, verbose_name='picture'),
        ),
    ]
