from django.urls import path

from . import views

app_name = "graph"

urlpatterns = [
    path(views.GRAPH_PING_PATH, views.graph_ping, name="ping"),
    path(views.GRAPH_CREATE_PATH, views.graph_create, name="create"),
    path(views.GRAPH_GET_PATH, views.graph_get, name="get"),
    path(views.GRAPH_PATCH_PATH, views.graph_patch, name="patch"),
    path(views.GRAPH_DELETE_PATH, views.graph_delete, name="delete"),
    path(views.GRAPH_SHARE_PATH, views.graph_share, name="share"),
    path(
        views.NODE_POSITION_CREATE_PATH,
        views.node_position_create,
        name="node-position-create",
    ),
    path(
        views.NODE_POSITION_PATCH_PATH,
        views.node_position_patch,
        name="node-position-patch",
    ),
    path(
        views.NODE_POSITION_DELETE_PATH,
        views.node_position_delete,
        name="node-position-delete",
    ),
    path(
        views.NODE_COLOR_CREATE_PATH,
        views.node_color_create,
        name="node-color-create",
    ),
    path(
        views.NODE_COLOR_PATCH_PATH,
        views.node_color_patch,
        name="node-color-patch",
    ),
    path(
        views.NODE_COLOR_DELETE_PATH,
        views.node_color_delete,
        name="node-color-delete",
    ),
]
