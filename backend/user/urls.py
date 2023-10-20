from django.urls import path

from .views import ping, user_signup, user_login, user_update

app_name = "user"
urlpatterns = [
    path("ping/", ping, name="ping"),
    path("signup/", user_signup, name="create"),
    path("login/", user_login, name="login"),
    path("update/", user_update, name="update"),
]
