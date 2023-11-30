# routing.py
from django.urls import re_path
from .consumers import CommentConsumer

websocket_urlpatterns = [
    re_path(r"ws/comment/$", CommentConsumer.as_asgi()),
]
