from django.contrib import admin
from .models import Camera, Route, Waypoint
from import_export import resources
from import_export.admin import ImportExportModelAdmin
# Register your models here.


class CameraResource(resources.ModelResource):
    class Meta:
        model = Camera


class CameraAdmin(ImportExportModelAdmin):
    resource_class = CameraResource


admin.site.register(Camera, CameraAdmin)
admin.site.register(Route)
admin.site.register(Waypoint)
