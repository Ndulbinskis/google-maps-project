import os
from django.http import Http404, HttpResponseRedirect, HttpResponse
from django.shortcuts import render
from django.utils import timezone
from .models import Camera, Route, Waypoint
import json
import datetime
# Create your views here.
import xml.etree.ElementTree as ET
from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import login, authenticate, logout  # add this
from django.contrib import messages
from django.contrib.auth.forms import AuthenticationForm  # add this
from django.contrib.auth.decorators import login_required
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.conf import settings
from xml.etree import ElementTree
from xml.dom import minidom
from django.http import JsonResponse


@login_required(redirect_field_name='login')
def gmap(request):
    current_user = request.user
    if request.method == "POST":
        lng = request.POST['lng']
        lat = request.POST['lat']
        area = request.POST['area']
        address = request.POST['addr']
        postcode = request.POST['postcode']
        if not (lng == '' or lat == '' or area == '' or address == '' or postcode == ''):
            cam = Camera(area=area)
            cam.longitude = lng
            cam.latitude = lat
            cam.type = 'CCTV'
            cam.street = address
            cam.postcode = postcode
            cam.save()
            messages.add_message(request, messages.SUCCESS, "Saved!")
        else:
            messages.add_message(request, messages.ERROR, "Not saved!")

        # form of query set
    points = Camera.objects.values(
        'id', 'latitude', 'longitude', 'area', 'street', 'postcode')
    # in order to pass query set to html we transform it to json

    if request.method == "POST":
        return HttpResponseRedirect("./")
    return render(request, "gmap/map.html", {"points": json.dumps(list(points)), "current_user": current_user})


@login_required(redirect_field_name='login')
def dashboard(request):
    current_user = request.user
    group = list(current_user.groups.values_list('name', flat=True))[0]
    if group == 'admin':
        return get_users(request)
    else:
        return render(request, "gmap/index.html", {"current_user": current_user})


@login_required(redirect_field_name='login')
def get_users(request):
    User = get_user_model()
    current_user = request.user
    if request.method == "POST":
        username = request.POST['username']
        password = request.POST['password']
        email = request.POST['email']
        group = request.POST['group']
        user_group = Group.objects.get(name=group)
        if 'id' in request.POST:
            user_id = request.POST['id']
            user = User.objects.get(id=user_id)
            user.username = username
            user.password = password
            user.email = email
            user.save()
            if not user.groups.filter(name=group).exists():
                prev_user_group = user.groups.all()[0]
                prev_user_group.user_set.remove(user)
                user_group.user_set.add(user)
        else:
            user = User.objects.create_user(
                username, email, password)
            user.save()
            user_group.user_set.add(user)

    users = User.objects.all()
    for u in users:
        u.grp = u.groups.all()[0]

    return render(request, "gmap/users.html", {"users": users, "current_user": current_user})


@login_required(redirect_field_name='login')
def get_user(request, user_id):
    User = get_user_model()
    users = User.objects.all()
    current_user = request.user
    for u in users:
        u.grp = u.groups.all()[0]
    try:
        user = User.objects.get(id=user_id)
        user.grp = user.groups.all()[0]
    except User.DoesNotExist:
        raise Http404("User does not exist")
    return render(request, "gmap/users.html", {"users": users, "editedUser": user, "current_user": current_user})


@login_required(redirect_field_name='login')
def delete_camera(request):
    cam_id = request.POST['rmv_frm_id']
    if cam_id != "":
        try:
            cam = Camera.objects.get(id=cam_id)
            cam.delete()
            messages.add_message(request, messages.SUCCESS, "Camera Deleted!")
        except:
            messages.add_message(request, messages.ERROR,
                                 "Camera Not Deleted!")

    points = Camera.objects.values(
        'id', 'latitude', 'longitude', 'area', 'street', 'postcode')
    return render(request, "gmap/map.html", {"points": json.dumps(list(points))})


@login_required(redirect_field_name='login')
def delete_user(request, user_id):
    try:
        User = get_user_model()
        u = User.objects.get(id=user_id)
        u.delete()
        users = User.objects.all()
        for u in users:
            u.grp = u.groups.all()[0]
        messages.success(request, "The user is deleted")
    except User.DoesNotExist:
        raise Http404("User does not exist")
    return render(request, "gmap/users.html", {"users": users})


def login_request(request):
    if request.method == "POST":
        form = AuthenticationForm(data=request.POST)
        # username : investigator
        # password: inves123
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                messages.info(request, f"You are now logged in as {username}.")
                return redirect('dashboard')
            else:
                messages.error(request, "Invalid username or password.")
        else:
            messages.error(request, "Invalid username or password.")
    form = AuthenticationForm()
    return render(request=request, template_name="gmap/login.html", context={"login_form": form})


def logout_request(request):
    logout(request)
    return redirect('login')


@login_required(redirect_field_name='login')
def save_route(request):
    current_user = request.user
    points = Camera.objects.values(
        'id', 'latitude', 'longitude', 'area', 'street', 'postcode')
    r = Route.objects.create(created_at=timezone.now(),
                             name=request.POST['route_name'])
    r.route_creator = current_user
    if request.method == "POST":
        wayPoints = request.POST['wayPoints']
        wayPoints = json.loads(wayPoints)

        if len(wayPoints) > 0:
            for p in wayPoints:
                w = r.waypoint_set.create(
                    latitude=p['location']['lat'],
                    longitude=p['location']['lng'],
                    created_at=datetime.datetime.fromtimestamp(
                        p['location']['created_at']/1000),
                    speed=p['location']['speed']
                )
                w.save()
                messages.add_message(request, messages.SUCCESS, "Case Saved!")
            r.save()
            print(r)
        else:
            messages.add_message(request, messages.ERROR, "Case not saved!")
    return render(request, "gmap/map.html",  {"points": json.dumps(list(points)), "current_user": current_user})


@login_required(redirect_field_name='login')
def update_route(request):
    route_id = request.POST['route_id']
    route_status = request.POST['route_status']
    r = Route.objects.get(id=route_id)
    r.reviewer = request.user
    r.status = route_status
    if request.POST.get("wayPoints"):
        print("there r wayPoints!")
        wayPoints = request.POST['wayPoints']
        wayPoints = json.loads(wayPoints)
        for p in wayPoints:
            print(p)

    r.save()
    return show_route(request, route_id=route_id, slug='true')


@login_required(redirect_field_name='login')
def get_routes(request):

    current_user = request.user
    current_user_group = list(
        current_user.groups.values_list('name', flat=True))[0]
    if current_user_group == "investigator":
        routes = Route.objects.all().filter(route_creator=current_user)
    elif current_user_group == "reviewer":
        routes = Route.objects.all().filter(reviewer=current_user)
    else:
        routes = Route.objects.all()

    if current_user_group == "lead_investigator":
        User = get_user_model()
        reviewers = User.objects.filter(groups__name__in=['reviewer'])
        return render(request, "gmap/routes.html", {"routes": routes, "current_user": current_user, "reviewers": reviewers})
    return render(request, "gmap/routes.html", {"routes": routes, "current_user": current_user})


def default(o):
    if isinstance(o, (datetime.date, datetime.datetime)):
        return datetime.datetime.timestamp(o)


@login_required(redirect_field_name='login')
def show_route(request, route_id, slug):
    current_user = request.user
    route = Route.objects.get(id=route_id)
    waypoints = Route.objects.get(
        id=route_id).waypoint_set.all().values_list("latitude", "longitude", "created_at")
    points = Camera.objects.values(
        'id', 'latitude', 'longitude', 'area', 'street', 'postcode')
    print("in show route!")
    return render(request,
                  "gmap/map.html",
                  {
                      "waypoints": json.dumps(list(waypoints),
                                              default=default),
                      "points": json.dumps(list(points)),
                      "route": route,
                      "current_user": current_user,
                      "edit_route": slug
                  }
                  )


@csrf_exempt
def updateKMLfile(request):
    xml_file_path = os.path.join(
        settings.BASE_DIR, 'gmap/static/components/cta.kml')
    xml_file_as_doc = minidom.parse(xml_file_path)
    placemarks = xml_file_as_doc.getElementsByTagName('Placemark')
    coordinates = request.POST.get('data')
    file_updates = xml_file_as_doc.toxml().split(
        "</Document>")[0]+coordinates+"</Document></kml>"

    xml_file = open(xml_file_path, "w")
    xml_file.write(file_updates)
    xml_file.close()
    return HttpResponse('')


@csrf_exempt
def resetKMLfile(request):
    xml_file_path = os.path.join(
        settings.BASE_DIR, 'gmap/static/components/cta.kml')
    xml_file_as_doc = minidom.parse(xml_file_path)
    placemarks = xml_file_as_doc.getElementsByTagName('Placemark')

    for placemark in placemarks:
        placemark.parentNode.removeChild(placemark)
        # placemark.firstChild.replaceWholeText("#greyLine")
    xml_file = open(xml_file_path, "w")
    xml_file.write(xml_file_as_doc.toxml())
    xml_file.close()
    return HttpResponse('')


def calculate_statistics(request):
    routes = Route.objects.all()
    cities_to_cases = {}
    for r in routes:
        print(cities_to_cases)
        if r.waypoint_set.all().count() > 0:
            city = r.waypoint_set.all()[0].city()
            if city in cities_to_cases:
                cities_to_cases[city] += 1
            else:
                cities_to_cases[city] = 1
    return JsonResponse(cities_to_cases)

@csrf_exempt
def get_statistics(request):
    print("in get")
    current_user = request.user
    routes = Route.objects.all()
    cities_to_cases = {}
    # for r in routes:
    #     if r.waypoint_set.all().count() > 0:
    #         city = r.waypoint_set.all()[0].city()
    #         if city in cities_to_cases:
    #             cities_to_cases[city] += 1
    #         else:
    #             cities_to_cases[city] = 1
    return render(request, "gmap/statistics.html", {"current_user": current_user, "y": list(cities_to_cases.values()), "x": list(cities_to_cases.keys())})


def update_route_reviewer(request):
    User = get_user_model()
    route = Route.objects.get(id=request.POST["route_id"])
    route.reviewer = User.objects.get(id=request.POST["reviewer_id"])
    route.save()
    return get_routes(request)
