# Generated by Django 3.2.8 on 2022-04-16 10:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gmap', '0003_route_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='waypoint',
            name='speed',
            field=models.PositiveIntegerField(blank=True, null=True),
        ),
    ]
