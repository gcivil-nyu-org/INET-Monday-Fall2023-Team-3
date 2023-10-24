from django.urls import path
from . import views

urlpatterns = [
    path("ping/", views.ping, name="ping"),
    path("node/", views.node_list, name="node-list"),
    path("node/predefined/", views.predefined_node_list, name="predefined-node-list"),
    path("node/create/", views.node_create, name="node-create"),
    path("node/<int:pk>/", views.node_detail, name="node-detail"),
]
