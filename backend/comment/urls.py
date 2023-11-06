from django.urls import path

from .views import ping, comment_create, comment_get, comments_by_node, comment_update, comment_delete


app_name = "comment"

urlpatterns = [
    path("ping/", ping, name="ping"),
    path("create/", comment_create, name="comment-create"),
    path("get/<str:comment_id>/", comment_get, name="comment-get"),
    path("get-by-node/<str:node_id>/", comments_by_node, name="comments-by-node"),
    path("update/", comment_update, name="comment-update"),
    path("delete/<str:comment_id>/", comment_delete, name="comment-delete"),
]
