from django.urls import path

from .views import ping, edge_create, edge_get, edge_update, edge_delete


app_name = "edge"

urlpatterns = [
    path("ping/", ping, name="ping"),
    path("create/", edge_create, name="create"),
    path("get/<str:edge_id>/", edge_get, name="get"),
    path("update/", edge_update, name="update"),
    path("delete/<str:edge_id>/", edge_delete, name="delete"),
]
