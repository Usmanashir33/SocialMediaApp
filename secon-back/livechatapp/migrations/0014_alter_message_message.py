# Generated by Django 5.0.7 on 2024-09-08 00:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('livechatapp', '0013_community_picture'),
    ]

    operations = [
        migrations.AlterField(
            model_name='message',
            name='message',
            field=models.TextField(blank=True, null=True, verbose_name='Message'),
        ),
    ]
