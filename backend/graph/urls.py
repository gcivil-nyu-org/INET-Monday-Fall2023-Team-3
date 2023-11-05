from django.urls import path
from . import views

app_name = "graph"

urlpatterns = [
    path("ping/", views.ping, name="ping"),
    path("graphs/", views.graph_list, name="graph-list"),
<<<<<<< HEAD
    path("get/<str:graph_id>/", views.graph_get, name="get"),
    path("create/", views.graph_create, name="graph-create"),
    path("delete/<str:graph_id>/", views.graph_delete, name="graph-delete"),
    path("update-add/<str:graph_id>", views.graph_update, name="graph-update-add"),
    path("update-delete/<str:graph_id>", views.graph_update, name="graph-update-delete"),
    # path("add_node/<str:graph_id>/", views.graph_add_node, name="graph-add-node"),
=======
    path("create/", views.graph_create, name="graph-create"),
    path("update-add/", views.graph_update_add, name="graph-update-add"),
    path("update-delete/", views.graph_update_delete, name="graph-update-delete"),
>>>>>>> graph-interface-yl
]
