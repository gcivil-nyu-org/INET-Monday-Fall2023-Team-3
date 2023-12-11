from django.urls import path

from . import views

app_name = "node"

urlpatterns = [
    path(views.NODE_PING_PATH, views.node_ping, name="ping"),
    path(views.NODE_CREATE_PATH, views.node_create, name="create"),
    path(views.NODE_GET_PATH, views.node_get, name="get"),
    path(views.NODE_PATCH_PATH, views.node_patch, name="patch"),
    path(views.NODE_DELETE_PATH, views.node_delete, name="delete"),
    path(
        views.NODE_GET_PREDEFINED_PATH, views.node_get_predefined, name="get-predefined"
    ),
]
