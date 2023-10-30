from django.urls import path
from . import views

urlpatterns = [
    path("ping/", views.ping, name="ping"),
    path("nodes/", views.node_list, name="node-list"),
    path("nodes/create/", views.node_create, name="node-create"),
    path("nodes/edit/", views.node_edit, name="node-edit"),
    path("nodes/<int:pk>/", views.node_detail, name="node-detail"),
]
