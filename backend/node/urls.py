from django.urls import path

from .views import (
    ping,
    node_create,
    node_get,
    node_update,
    node_delete,
    node_get_predefined,
)

app_name = "node"

urlpatterns = [
    path("ping/", ping, name="ping"),
    path("create/", node_create, name="create"),
    path("get/<str:node_id>/", node_get, name="get"),
    path("update/", node_update, name="update"),
    path("delete/<str:node_id>/", node_delete, name="delete"),
    path("predefined-nodes/", node_get_predefined, name="node-predefined"),
]
