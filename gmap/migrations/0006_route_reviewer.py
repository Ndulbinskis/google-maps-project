# Generated by Django 3.2.8 on 2022-04-16 14:37

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('gmap', '0005_route_status'),
    ]

    operations = [
        migrations.AddField(
            model_name='route',
            name='reviewer',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL),
        ),
    ]