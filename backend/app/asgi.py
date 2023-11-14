"""
ASGI config for app project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""

import os
import django
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.core.asgi import get_asgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "app.settings")
django.setup()
# application = get_asgi_application()

import comment.routing  # noqa: E402

application = ProtocolTypeRouter(
    {
        "http": get_asgi_application(),  # HTTP handler
        "websocket": AuthMiddlewareStack(
            URLRouter(comment.routing.websocket_urlpatterns)
        ),
    }
)
