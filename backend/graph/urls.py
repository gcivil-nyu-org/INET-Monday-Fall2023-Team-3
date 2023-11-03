from django.urls import path
from . import views

app_name = "graph"

urlpatterns = [
    path("ping/", views.ping, name="ping"),
    path("graphs/", views.graph_list, name="graph-list"),
    path("create/", views.graph_create, name="graph-create"),
]
