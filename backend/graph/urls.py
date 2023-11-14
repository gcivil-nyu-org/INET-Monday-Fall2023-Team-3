from django.urls import path
from . import views

app_name = "graph"

urlpatterns = [
    path("ping/", views.ping, name="ping"),
    path("graphs/", views.graph_list, name="graph-list"),
    path("get/<str:graph_id>/", views.graph_get, name="get"),
    path("create/", views.graph_create, name="graph-create"),
    path("delete/<str:graph_id>/", views.graph_delete, name="graph-delete"),
    path("update-add/", views.graph_update_add, name="graph-update-add"),
    path("update-delete/", views.graph_update_delete, name="graph-update-delete"),
    # get a list of ids of graphs owned by the user
    path("list-get/<str:user_email>/", views.graph_list_get, name="graph-get-list"),
    path("node-position/", views.node_position_set, name="graph-node-position"),
    path("title-set/", views.graph_title_set, name="graph-title-set")
    # path("add_node/<str:graph_id>/", views.graph_add_node, name="graph-add-node"),
]
