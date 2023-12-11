from django.urls import path

from . import views

app_name = "comment"

urlpatterns = [
    path(views.COMMENT_PING_PATH, views.comment_ping, name="ping"),
    # node comment endpoints
    path(
        views.NODE_COMMENT_CREATE_PATH,
        views.node_comment_create,
        name="node-comment-create",
    ),
    path(views.NODE_COMMENT_GET_PATH, views.node_comment_get, name="node-comment-get"),
    path(
        views.NODE_COMMENT_GET_BY_NODE_PATH,
        views.node_comment_get_by_node,
        name="node-comment-get-by-node",
    ),
    path(
        views.NODE_COMMENT_PATCH_PATH,
        views.node_comment_patch,
        name="node-comment-patch",
    ),
    path(
        views.NODE_COMMENT_DELETE_PATH,
        views.node_comment_delete,
        name="node-comment-delete",
    ),
    # graph comment endpoints
    path(
        views.GRAPH_COMMENT_CREATE_PATH,
        views.graph_comment_create,
        name="graph-comment-create",
    ),
    path(
        views.GRAPH_COMMENT_GET_PATH, views.graph_comment_get, name="graph-comment-get"
    ),
    path(
        views.GRAPH_COMMENT_GET_BY_GRAPH_PATH,
        views.graph_comment_get_by_graph,
        name="graph-comment-get-by-graph",
    ),
    path(
        views.GRAPH_COMMENT_PATCH_PATH,
        views.graph_comment_patch,
        name="graph-comment-patch",
    ),
    path(
        views.GRAPH_COMMENT_DELETE_PATH,
        views.graph_comment_delete,
        name="graph-comment-delete",
    ),
]
