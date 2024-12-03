# Generated by Django 5.0.7 on 2024-08-21 18:32

import posts.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0002_post_not_interested'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='file',
            field=models.FileField(blank=True, upload_to=posts.models.upload_location, verbose_name='post file'),
        ),
    ]
