from django.urls import path
from . import views

app_name = "graph"

urlpatterns = [
    path("ping/", views.ping, name="ping"),
    path("graphs/", views.graph_list, name="graph-list"),
    path("create/", views.graph_create, name="graph-create"),
    path("update-add/", views.graph_update_add, name="graph-update-add"),
    path("update-delete/", views.graph_update_delete, name="graph-update-delete"),
]
