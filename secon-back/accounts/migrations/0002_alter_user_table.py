# Generated by Django 5.0.7 on 2024-08-01 12:40

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelTable(
            name='user',
            table='accounts_user',
        ),
    ]
