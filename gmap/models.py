from django.db import models
from django.db.models import Avg
from django.db.models.functions import Round
from django.core.validators import MaxValueValidator, MinValueValidator
from django.contrib.auth import get_user_model
import geopy.distance
import geopy.geocoders
import certifi
import ssl

# Create your models here.


class Camera(models.Model):
    area = models.CharField(max_length=100)
    latitude = models.FloatField(

        validators=[MinValueValidator(-90), MaxValueValidator(90)],
    )
    longitude = models.FloatField(
        validators=[MinValueValidator(-180), MaxValueValidator(180)],
    )
    type = models.CharField(max_length=100)
    street = models.CharField(max_length=100)
    postcode = models.CharField(max_length=12)

    def __str__(self):
        return f"{self.id}: {self.area}, {self.type}, {self.street}, {self.postcode}, ({self.latitude},{self.longitude})"


class Route(models.Model):

    created_at = models.DateTimeField('date created')
    name = models.CharField(max_length=100)
    status = models.CharField(max_length=100, default='pending')
    reviewer = models.ForeignKey(
        get_user_model(), on_delete=models.SET_NULL, null=True, related_name='reviewer')
    route_creator = models.ForeignKey(
        get_user_model(), on_delete=models.SET_NULL, null=True, related_name='route_creator')

    def __str__(self):
        return f"Route {self.id}: {self.created_at},creator:{self.route_creator},status:{self.status}"

    def avg_speed(self):
        return self.waypoint_set.aggregate(
            Avg('speed')
        )['speed__avg']


class Waypoint(models.Model):
    latitude = models.FloatField(
        validators=[MinValueValidator(-90), MaxValueValidator(90)],
    )
    longitude = models.FloatField(
        validators=[MinValueValidator(-180), MaxValueValidator(180)],
    )
    created_at = models.DateTimeField('date created')
    speed = models.PositiveIntegerField(null=True, blank=True)
    route = models.ForeignKey(Route, on_delete=models.CASCADE)

    def __str__(self):
        return f"waypoint {self.id}: {self.latitude}, {self.longitude}, {self.created_at},{self.route})"

    def distance(self):
        route_pnts_list = list(self.route.waypoint_set.all())
        coords_1 = (self.latitude, self.longitude)
        pnt1_i = (*route_pnts_list,).index(self)
        if pnt1_i == 0:
            return 0
        pnt2 = route_pnts_list[pnt1_i-1]
        coords_2 = (pnt2.latitude, pnt2.longitude)
        return round(geopy.distance.distance(coords_1, coords_2).km, 3)

    def city(self):
        ctx = ssl.create_default_context(cafile=certifi.where())
        geopy.geocoders.options.default_ssl_context = ctx
        location = geopy.geocoders.GoogleV3("AIzaSyB58CtCPUBsCAagvDpQ2VOHWvr56p0H4XE").reverse(
            str(self.latitude)+","+str(self.longitude), exactly_one=True).raw
        data = location['address_components']
        state = ""
        for d in data:
            if d["types"][0] == "postal_town":
                state = d['short_name']
                return state
        return state
