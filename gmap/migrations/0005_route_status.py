# Generated by Django 3.2.8 on 2022-04-16 14:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gmap', '0004_waypoint_speed'),
    ]

    operations = [
        migrations.AddField(
            model_name='route',
            name='status',
            field=models.CharField(default='pending', max_length=100),
        ),
    ]
