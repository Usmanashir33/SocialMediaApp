# Generated by Django 5.0.7 on 2024-08-24 16:56

import posts.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0005_alter_post_body'),
    ]

    operations = [
        migrations.AddField(
            model_name='comment',
            name='file',
            field=models.FileField(blank=True, null=True, upload_to=posts.models.upload_location_comment, verbose_name='comment file'),
        ),
    ]
