from django.urls import path

from .views import ping, user_create, user_get, user_login, user_update

app_user = "user"

urlpatterns = [
    path("ping/", ping, name="ping"),
    path("create/", user_create, name="create"),
    path("login/", user_login, name="login"),
    path("get/", user_get, name="get"),
    path("update/", user_update, name="update"),
]
