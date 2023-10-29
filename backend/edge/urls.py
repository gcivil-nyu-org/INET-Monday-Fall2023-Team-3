from django.urls import path
from . import views

urlpatterns = [
    path("ping/", views.ping, name="ping"),
    path("create/", views.edge_create, name="edge-create"),
    path("delete/<int:pk>/", views.edge_delete, name="edge-delete"),
    path("getedge/<int:pk>/", views.edge_get, name="edge-get")
]
