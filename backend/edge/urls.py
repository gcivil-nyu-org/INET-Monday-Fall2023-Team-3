from django.urls import path

from . import views

app_name = "edge"

urlpatterns = [
    path(views.EDGE_PING_PATH, views.edge_ping, name="ping"),
    path(views.EDGE_CREATE_PATH, views.edge_create, name="create"),
    path(views.EDGE_GET_PATH, views.edge_get, name="get"),
    path(views.EDGE_PATCH_PATH, views.edge_patch, name="patch"),
    path(views.EDGE_DELETE_PATH, views.edge_delete, name="delete"),
]
