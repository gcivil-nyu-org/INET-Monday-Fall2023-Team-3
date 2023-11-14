# routing.py
from django.urls import path
from .consumers import CommentConsumer

websocket_urlpatterns = [
    path("ws/comment/", CommentConsumer.as_asgi()),
]
