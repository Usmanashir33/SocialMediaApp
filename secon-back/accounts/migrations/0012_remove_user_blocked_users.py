# Generated by Django 5.0.7 on 2024-11-22 13:09

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0011_alter_user_blocked_users'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='blocked_users',
        ),
    ]