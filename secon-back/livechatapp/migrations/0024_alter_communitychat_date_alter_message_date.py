# Generated by Django 5.0.7 on 2024-11-22 11:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('livechatapp', '0023_alter_communitychat_delete_for_me_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='communitychat',
            name='date',
            field=models.DateTimeField(auto_now_add=True, null=True, verbose_name='Message_date'),
        ),
        migrations.AlterField(
            model_name='message',
            name='date',
            field=models.DateTimeField(auto_now_add=True, null=True, verbose_name='Message_date'),
        ),
    ]
