from django.urls import path
from . import views

urlpatterns = [
    path("ping/", views.ping, name="ping"),
    path("nodes/", views.node_list, name="node-list"),
    path("create/", views.node_create, name="node-create"),
    path("edit/", views.node_edit, name="node-edit"),
    path("predefined-nodes/", views.predefined_node_list, name="predefined-node-list"),
]
