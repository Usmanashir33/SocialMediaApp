# Generated by Django 5.0.7 on 2024-08-01 10:13

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0003_testing_followers'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='t',
            name='followers',
        ),
    ]
