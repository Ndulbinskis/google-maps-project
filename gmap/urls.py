from django.urls import path
from.import views


urlpatterns = [
    path('', views.dashboard, name="dashboard"),
    path('map/',  views.gmap, name="gmap"),
    path('camera/delete/', views.delete_camera, name="deleteCam"),
    path('statistics/', views.get_statistics, name="statistics"),
    path('users/', views.get_users, name="users"),
    path('users/<int:user_id>', views.get_user, name="user"),
    path('users/<int:user_id>/delete', views.delete_user, name="deleteUser"),
    path("login/", views.login_request, name="login"),
    path("logout/", views.logout_request, name="logout"),
    path("waypoints/save/", views.save_route, name="saveWaypoints"),
    path("routes/", views.get_routes, name="routes"),
    path("route/<int:route_id>/<slug:slug>/",
         views.show_route, name="showRoute"),
    path("route/update/", views.update_route, name="updateRoute"),
    path("route/update_reviewer/", views.update_route_reviewer,
         name="updateRouteReviewer"),
    path("route/save-steps-to-kml", views.updateKMLfile, name="abc"),
    path("route/reset-kml", views.resetKMLfile, name="abc"),
    path("route/statistics/", views.calculate_statistics, name="getStatistics")

]
