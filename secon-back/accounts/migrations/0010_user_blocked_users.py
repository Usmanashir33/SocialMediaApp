# Generated by Django 5.0.7 on 2024-11-22 11:21

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0009_user_picture'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='blocked_users',
            field=models.ManyToManyField(blank=True, null=True, related_name='blockedby', to=settings.AUTH_USER_MODEL, verbose_name='blocked users'),
        ),
    ]
