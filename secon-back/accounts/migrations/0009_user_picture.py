# Generated by Django 5.0.7 on 2024-09-01 17:29

import accounts.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0008_remove_user_picture'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='picture',
            field=models.ImageField(blank=True, default='default.jpg', null=True, upload_to=accounts.models.set_picture, verbose_name='profile pic'),
        ),
    ]