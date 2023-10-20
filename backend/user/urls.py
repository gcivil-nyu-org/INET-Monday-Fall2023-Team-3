from django.urls import path

from .views import ping, user_signup, user_login, user_update, user_get

app_name = "user"
urlpatterns = [
    path("ping/", ping, name="ping"),
    path("signup/", user_signup, name="create"),
    path("login/", user_login, name="login"),
    path("update/", user_update, name="update"),
    path("get/", user_get, name="get"),
]
