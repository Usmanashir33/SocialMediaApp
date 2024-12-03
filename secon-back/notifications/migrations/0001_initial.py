# Generated by Django 5.0.7 on 2024-08-13 08:16

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Notification',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('message', models.CharField(max_length=50, verbose_name='notification')),
                ('is_read', models.BooleanField(default=False, verbose_name='is read')),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='date')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='user notification')),
            ],
        ),
    ]
