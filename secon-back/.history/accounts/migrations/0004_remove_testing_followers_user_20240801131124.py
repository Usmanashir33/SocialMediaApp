# Generated by Django 5.0.7 on 2024-08-01 12:02

import django.contrib.auth.models
import django.utils.timezone
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0003_testing_fo'),
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='followers',
        ),
       
    ]