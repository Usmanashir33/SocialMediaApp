# Generated by Django 5.0.7 on 2024-08-23 22:31

import posts.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0003_post_file'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='file',
            field=models.FileField(blank=True, null=True, upload_to=posts.models.upload_location, verbose_name='post file'),
        ),
    ]
