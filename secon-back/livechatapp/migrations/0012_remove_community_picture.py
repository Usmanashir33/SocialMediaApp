# Generated by Django 5.0.7 on 2024-09-07 14:13

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('livechatapp', '0011_alter_community_picture'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='community',
            name='picture',
        ),
    ]
